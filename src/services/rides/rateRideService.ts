import { prisma } from "../../libs/prisma";

export async function rateRideService(
  rideId: string,
  userId: string,
  data: { rating: number; ratedUserId?: string },
) {
  const ride = await prisma.ride.findUnique({
    where: { id: rideId },
    include: {
      passengers: { select: { id: true } },
      ratedByUsers: { select: { id: true } },
    },
  });

  if (!ride) {
    throw { statusCode: 404, message: "Boleia nao encontrada." };
  }

  if (ride.status !== "completed") {
    throw {
      statusCode: 400,
      message: "So e possivel avaliar boleias concluidas.",
    };
  }

  const isDriver = ride.driverId === userId;
  const isPassenger = ride.passengers.some(
    (passenger) => passenger.id === userId,
  );

  if (!isDriver && !isPassenger) {
    throw { statusCode: 403, message: "Nao participaste nesta boleia." };
  }

  if (ride.ratedByUsers.some((user) => user.id === userId)) {
    throw { statusCode: 409, message: "Ja avaliaste esta boleia." };
  }

  const ratedUserId = data.ratedUserId ?? ride.driverId;
  const ratedUser = await prisma.user.findUnique({
    where: { id: ratedUserId },
  });

  if (!ratedUser) {
    throw { statusCode: 404, message: "Utilizador a avaliar nao encontrado." };
  }

  const newRating =
    (ratedUser.rating * ratedUser.totalTrips + data.rating) /
    (ratedUser.totalTrips + 1);

  await prisma.$transaction(async (tx) => {
    await tx.ride.update({
      where: { id: rideId },
      data: { ratedByUsers: { connect: { id: userId } } },
    });

    await tx.user.update({
      where: { id: ratedUserId },
      data: {
        rating: newRating,
        totalTrips: { increment: 1 },
      },
    });
  });

  return { message: "Avaliacao registada com sucesso.", newRating };
}
