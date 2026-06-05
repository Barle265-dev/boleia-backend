import { randomUUID } from "crypto";
import { prisma } from "../../../libs/prisma";

export async function respondFreightService(
  id: string,
  action: "accepted" | "declined",
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
    throw { statusCode: 403, message: "So um fretista pode responder a este pedido." };
  }

  if (freight.specificFretistaId && freight.specificFretistaId !== userId) {
    throw { statusCode: 403, message: "So o fretista designado pode responder a este pedido." };
  }

  if (freight.status !== "pending") {
    throw { statusCode: 400, message: "Este pedido ja foi respondido." };
  }

  const updated = await prisma.freightRequest.update({
    where: { id },
    data: {
      status: action,
      fretistaId: action === "accepted" ? userId : freight.fretistaId,
    },
    include: {
      requester: { select: { id: true, name: true, photoUrl: true, rating: true } },
      fretista: { select: { id: true, name: true, photoUrl: true, rating: true } },
    },
  });

  const isAccepted = action === "accepted";
  await prisma.notification.create({
    data: {
      id: randomUUID(),
      userId: freight.requesterId,
      title: isAccepted ? "Frete aceite!" : "Frete recusado",
      message: isAccepted
        ? `O teu pedido de frete de ${freight.origin} para ${freight.destination} foi aceite.`
        : `O teu pedido de frete de ${freight.origin} para ${freight.destination} foi recusado.`,
      type: isAccepted ? "confirmation" : "system",
      link: `/my-rides?freight=${freight.id}`,
    },
  });

  return updated;
}
