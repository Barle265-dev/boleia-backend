import { prisma } from "../../../libs/prisma";
import { randomUUID } from "crypto";

export async function respondFreightService(
  id: string,
  action: "accepted" | "declined",
  userId: string
) {
  const freight = await prisma.freightRequest.findUnique({
    where: { id },
  });

  if (!freight) {
    throw { statusCode: 404, message: "Pedido de frete não encontrado." };
  }

  // Só o fretista designado pode responder
  if (freight.fretistaId !== userId) {
    throw { statusCode: 403, message: "Só o fretista designado pode responder a este pedido." };
  }

  if (freight.status !== "pending") {
    throw { statusCode: 400, message: "Este pedido já foi respondido." };
  }

  const updated = await prisma.freightRequest.update({
    where: { id },
    data: { status: action },
  });

  // Notificar o solicitante
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
    },
  });

  return updated;
}
