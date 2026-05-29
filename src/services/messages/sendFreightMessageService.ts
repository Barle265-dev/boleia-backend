import { prisma } from "../../../libs/prisma";
import { randomUUID } from "crypto";

export async function sendFreightMessageService(
  freightId: string,
  data: { text: string; recipientId: string },
  userId: string
) {
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

  const expectedRecipientId = isRequester ? freight.fretistaId : freight.requesterId;
  if (data.recipientId !== expectedRecipientId) {
    throw { statusCode: 400, message: "Destinatário inválido para este frete." };
  }

  if (freight.status === "declined") {
    throw { statusCode: 400, message: "Não é possível enviar mensagens num frete recusado." };
  }

  const message = await prisma.message.create({
    data: {
      id: randomUUID(),
      text: data.text,
      senderId: userId,
      recipientId: data.recipientId,
    },
    include: {
      sender: {
        select: { id: true, name: true, photoUrl: true },
      },
      recipient: {
        select: { id: true, name: true, photoUrl: true },
      },
    },
  });

  return message;
}
