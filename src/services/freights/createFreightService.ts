import { randomUUID } from "crypto";
import { prisma } from "../../../libs/prisma";
import { CreateFreightRequestDto } from "types";

export async function createFreightService(
  data: Omit<CreateFreightRequestDto, "id" | "requesterId" | "status">,
  requesterId: string,
) {
  const requestedFretistaId = data.specificFretistaId ?? data.fretistaId;

  if (requestedFretistaId) {
    const fretista = await prisma.user.findUnique({
      where: { id: requestedFretistaId },
    });

    if (!fretista) {
      throw { statusCode: 404, message: "Fretista nao encontrado." };
    }

    if (fretista.role !== "fretista") {
      throw { statusCode: 400, message: "O utilizador selecionado nao e um fretista." };
    }

    if (fretista.isBlocked) {
      throw { statusCode: 400, message: "Este fretista nao esta disponivel." };
    }

    if (requestedFretistaId === requesterId) {
      throw { statusCode: 400, message: "Nao podes solicitar um frete a ti mesmo." };
    }
  }

  const freight = await prisma.freightRequest.create({
    data: {
      id: randomUUID(),
      origin: data.origin,
      destination: data.destination,
      requestedTime: data.requestedTime ? new Date(data.requestedTime) : undefined,
      status: "pending",
      requesterId,
      specificFretistaId: requestedFretistaId,
    },
    include: {
      requester: {
        select: { id: true, name: true, photoUrl: true, rating: true },
      },
      fretista: {
        select: { id: true, name: true, photoUrl: true, rating: true },
      },
    },
  });

  const recipients = requestedFretistaId
    ? [requestedFretistaId]
    : (
        await prisma.user.findMany({
          where: { role: "fretista", isBlocked: false },
          select: { id: true },
        })
      ).map((user) => user.id);

  if (recipients.length) {
    await prisma.notification.createMany({
      data: recipients.map((userId) => ({
        id: randomUUID(),
        userId,
        title: "Novo pedido de frete",
        message: `Tens um novo pedido de frete de ${data.origin} para ${data.destination}.`,
        type: "request",
        link: `/my-rides?freight=${freight.id}`,
      })),
    });
  }

  return freight;
}
