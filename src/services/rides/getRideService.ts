import { prisma } from "../../../libs/prisma";

export async function getRideService(id: string) {
  const ride = await prisma.ride.findUnique({
    where: { id },
    include: {
      driver: {
        select: { id: true, name: true, rating: true, photoUrl: true, isVerified: true },
      },
      vehicle: true,
      passengers: {
        select: { id: true, name: true, photoUrl: true, rating: true, totalTrips: true },
      },
      pendingPassengers: {
        select: { id: true, name: true, photoUrl: true, rating: true, totalTrips: true },
      },
    },
  });

  if (!ride) {
    throw { statusCode: 404, message: "Boleia não encontrada." };
  }

  return ride;
}
