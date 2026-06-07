import { prisma } from "../../libs/prisma";

export async function listRideMessagesService(rideId: string, userId: string) {
  const ride = await prisma.ride.findUnique({
    where: { id: rideId },
    include: {
      passengers: { select: { id: true } },
    },
  });

  if (!ride) {
    throw { statusCode: 404, message: "Boleia não encontrada." };
  }

  const isDriver = ride.driverId === userId;
  const isPassenger = ride.passengers.some((p) => p.id === userId);

  if (!isDriver && !isPassenger) {
    throw { statusCode: 403, message: "Não fazes parte desta boleia." };
  }

  const messages = await prisma.message.findMany({
    where: { rideId },
    include: {
      sender: {
        select: { id: true, name: true, photoUrl: true },
      },
    },
    orderBy: { timestamp: "asc" },
  });

  return messages;
}
