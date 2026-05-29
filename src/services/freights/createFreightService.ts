import { prisma } from "../../../libs/prisma";
import { randomUUID } from "crypto";
import { CreateFreightRequestDto } from "types";

export async function createFreightService(
  data: Omit<CreateFreightRequestDto, "id" | "requesterId" | "status">,
  requesterId: string
) {
  // Valida que o fretista existe e tem o role correto
  const fretista = await prisma.user.findUnique({
    where: { id: data.fretistaId },
  });

  if (!fretista) {
    throw { statusCode: 404, message: "Fretista não encontrado." };
  }

  if (fretista.role !== "fretista") {
    throw { statusCode: 400, message: "O utilizador selecionado não é um fretista." };
  }

  if (fretista.isBlocked) {
    throw { statusCode: 400, message: "Este fretista não está disponível." };
  }

  // Utilizador não pode solicitar frete a si mesmo
  if (data.fretistaId === requesterId) {
    throw { statusCode: 400, message: "Não podes solicitar um frete a ti mesmo." };
  }

  const freight = await prisma.freightRequest.create({
    data: {
      id: randomUUID(),
      origin: data.origin,
      destination: data.destination,
      requestedTime: data.requestedTime ? new Date(data.requestedTime) : undefined,
      status: "pending",
      requesterId,
      fretistaId: data.fretistaId,
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

  // Notificar o fretista
  await prisma.notification.create({
    data: {
      id: randomUUID(),
      userId: data.fretistaId,
      title: "Novo pedido de frete",
      message: `Tens um novo pedido de frete de ${data.origin} para ${data.destination}.`,
      type: "request",
    },
  });

  return freight;
}
