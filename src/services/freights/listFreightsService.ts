import { prisma } from "../../../libs/prisma";

export async function listFreightsService(userId: string) {
  // Retorna fretes onde o utilizador é o solicitante ou o fretista
  const freights = await prisma.freightRequest.findMany({
    where: {
      OR: [
        { requesterId: userId },
        { fretistaId: userId },
      ],
    },
    include: {
      requester: {
        select: { id: true, name: true, photoUrl: true, rating: true },
      },
      fretista: {
        select: { id: true, name: true, photoUrl: true, rating: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return freights;
}
