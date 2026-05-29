import { prisma } from "../../../libs/prisma";

export async function listFreightMessagesService(freightId: string, userId: string) {
  const freight = await prisma.freightRequest.findUnique({
    where: { id: freightId },
  });

  if (!freight) {
    throw { statusCode: 404, message: "Pedido de frete não encontrado." };
  }

  const isRequester = freight.requesterId === userId;
  const isFretista = freight.fretistaId === userId;

  if (!isRequester && !isFretista) {
    throw { statusCode: 403, message: "Não fazes parte deste frete." };
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: freight.requesterId, recipientId: freight.fretistaId },
        { senderId: freight.fretistaId, recipientId: freight.requesterId },
      ],
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
