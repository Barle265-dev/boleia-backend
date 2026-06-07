import { prisma } from "../../libs/prisma";

export async function listFreightMessagesService(
  freightId: string,
  userId: string,
) {
  const freight = await prisma.freightRequest.findUnique({
    where: { id: freightId },
  });

  if (!freight) {
    throw { statusCode: 404, message: "Pedido de frete nao encontrado." };
  }

  const isRequester = freight.requesterId === userId;
  const isFretista = freight.fretistaId === userId;

  if (!isRequester && !isFretista) {
    throw { statusCode: 403, message: "Nao fazes parte deste frete." };
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: freight.fretistaId
        ? [
            { senderId: freight.requesterId, recipientId: freight.fretistaId },
            { senderId: freight.fretistaId, recipientId: freight.requesterId },
          ]
        : [{ senderId: freight.requesterId }],
    },
    include: {
      sender: {
        select: { id: true, name: true, photoUrl: true },
      },
      recipient: {
        select: { id: true, name: true, photoUrl: true },
      },
    },
    orderBy: { timestamp: "asc" },
  });

  return messages;
}
