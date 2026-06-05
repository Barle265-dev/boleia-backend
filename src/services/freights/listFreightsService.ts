import { prisma } from "../../../libs/prisma";

export async function listFreightsService(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  const freights = await prisma.freightRequest.findMany({
    where: {
      OR: [
        { requesterId: userId },
        { fretistaId: userId },
        { specificFretistaId: userId },
        ...(user?.role === "fretista"
          ? [{ status: "pending" as const, specificFretistaId: null }]
          : []),
      ],
    },
    include: {
      requester: {
        select: { id: true, name: true, photoUrl: true, rating: true, phone: true },
      },
      fretista: {
        select: { id: true, name: true, photoUrl: true, rating: true, phone: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return freights;
}
