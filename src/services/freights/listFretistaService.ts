import { prisma } from "../../../libs/prisma";

export async function listFretistaService() {
  const fretistas = await prisma.user.findMany({
    where: {
      role: "fretista",
      isBlocked: false,
    },
    select: {
      id: true,
      name: true,
      photoUrl: true,
      rating: true,
      totalTrips: true,
      phone: true,
      vehicles: true,
    },
    orderBy: { rating: "desc" },
  });

  return fretistas;
}
