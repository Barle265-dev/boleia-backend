import { prisma } from "../../../libs/prisma";

export async function getFreightService(id: string, userId: string) {
  const freight = await prisma.freightRequest.findUnique({
    where: { id },
    include: {
      requester: {
        select: { id: true, name: true, photoUrl: true, rating: true },
      },
      fretista: {
        select: { id: true, name: true, photoUrl: true, rating: true },
      },
    },
  });

  if (!freight) {
    throw { statusCode: 404, message: "Pedido de frete não encontrado." };
  }

  // Só o solicitante ou o fretista podem ver o detalhe
  if (freight.requesterId !== userId && freight.fretistaId !== userId) {
    throw { statusCode: 403, message: "Sem permissão para aceder a este pedido." };
  }

  return freight;
}
