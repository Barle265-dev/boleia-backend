import { randomUUID } from "crypto";
import { prisma } from "../../libs/prisma";

type FreightAction = "accepted" | "declined" | "in_progress" | "completed";

export async function respondFreightService(
  id: string,
  action: FreightAction,
  userId: string,
) {
  const freight = await prisma.freightRequest.findUnique({
    where: { id },
  });

  if (!freight) {
    throw { statusCode: 404, message: "Pedido de frete nao encontrado." };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (user?.role !== "fretista") {
    throw {
      statusCode: 403,
      message: "So um fretista pode responder a este pedido.",
    };
  }

  if (freight.specificFretistaId && freight.specificFretistaId !== userId) {
    throw {
      statusCode: 403,
      message: "So o fretista designado pode responder a este pedido.",
    };
  }

  if (
    (action === "accepted" || action === "declined") &&
    freight.status !== "pending"
  ) {
    throw { statusCode: 400, message: "Este pedido ja foi respondido." };
  }

  if (
    action === "in_progress" &&
    (freight.status !== "accepted" || freight.fretistaId !== userId)
  ) {
    throw {
      statusCode: 400,
      message: "So podes iniciar um frete aceite por ti.",
    };
  }

  if (
    action === "completed" &&
    (freight.status !== "in_progress" || freight.fretistaId !== userId)
  ) {
    throw {
      statusCode: 400,
      message: "So podes concluir um frete em curso por ti.",
    };
  }

  const updated = await prisma.$transaction(async (tx) => {
    const result =
      action === "accepted" || action === "declined"
        ? await tx.freightRequest.update({
            where: { id },
            data: {
              status: action,
              fretistaId: action === "accepted" ? userId : freight.fretistaId,
            },
            include: {
              requester: {
                select: {
                  id: true,
                  name: true,
                  photoUrl: true,
                  rating: true,
                  phone: true,
                },
              },
              fretista: {
                select: {
                  id: true,
                  name: true,
                  photoUrl: true,
                  rating: true,
                  phone: true,
                },
              },
            },
          })
        : await (async () => {
            await tx.$executeRaw`
              UPDATE "FreightRequest"
              SET "status" = ${action}::"FreightRequestStatus"
              WHERE "id" = ${id}::uuid
            `;

            const refreshed = await tx.freightRequest.findUnique({
              where: { id },
              include: {
                requester: {
                  select: {
                    id: true,
                    name: true,
                    photoUrl: true,
                    rating: true,
                    phone: true,
                  },
                },
                fretista: {
                  select: {
                    id: true,
                    name: true,
                    photoUrl: true,
                    rating: true,
                    phone: true,
                  },
                },
              },
            });

            if (!refreshed) {
              throw {
                statusCode: 404,
                message: "Pedido de frete nao encontrado.",
              };
            }

            return refreshed;
          })();

    if (action === "completed" && freight.fretistaId) {
      await tx.user.update({
        where: { id: freight.requesterId },
        data: { totalTrips: { increment: 1 } },
      });
      await tx.user.update({
        where: { id: freight.fretistaId },
        data: { totalTrips: { increment: 1 } },
      });
    }

    return result;
  });

  const notification =
    action === "accepted"
      ? {
          title: "Frete aceite!",
          message: `O teu pedido de frete de ${freight.origin} para ${freight.destination} foi aceite.`,
          type: "confirmation" as const,
          link: `/freight/${freight.id}`,
        }
      : action === "declined"
        ? {
            title: "Frete recusado",
            message: `O teu pedido de frete de ${freight.origin} para ${freight.destination} foi recusado.`,
            type: "system" as const,
            link: `/my-rides?freight=${freight.id}`,
          }
        : action === "in_progress"
          ? {
              title: "Frete em curso",
              message: `O teu frete de ${freight.origin} para ${freight.destination} foi iniciado.`,
              type: "confirmation" as const,
              link: `/freight/${freight.id}`,
            }
          : {
              title: "Frete concluido",
              message: `O teu frete de ${freight.origin} para ${freight.destination} foi concluido. Avalia a experiencia.`,
              type: "confirmation" as const,
              link: `/freight/${freight.id}?action=rate`,
            };

  await prisma.notification.create({
    data: {
      id: randomUUID(),
      userId: freight.requesterId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      link: notification.link,
    },
  });

  return updated;
}
