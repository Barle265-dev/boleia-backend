import { prisma } from "../../../libs/prisma";

export async function getFreightService(id: string, userId: string) {
  const freight = await prisma.freightRequest.findUnique({
    where: { id },
    include: {
      requester: {
        select: { id: true, name: true, photoUrl: true, rating: true, phone: true },
      },
      fretista: {
        select: { id: true, name: true, photoUrl: true, rating: true, phone: true },
      },
    },
  });

  if (!freight) {
    throw { statusCode: 404, message: "Pedido de frete nao encontrado." };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  const canView =
    freight.requesterId === userId ||
    freight.fretistaId === userId ||
    freight.specificFretistaId === userId ||
    (user?.role === "fretista" && freight.status === "pending" && !freight.specificFretistaId);

  if (!canView) {
    throw { statusCode: 403, message: "Sem permissao para aceder a este pedido." };
  }

  return freight;
}
