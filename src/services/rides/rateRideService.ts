import { prisma } from "../../../libs/prisma";

export async function rateRideService(
  rideId: string,
  userId: string,
  data: { rating: number; ratedUserId: string }
) {
  const ride = await prisma.ride.findUnique({
    where: { id: rideId },
    include: {
      passengers: { select: { id: true } },
      ratedByUsers: { select: { id: true } },
    },
  });

  if (!ride) {
    throw { statusCode: 404, message: "Boleia não encontrada." };
  }

  if (ride.status !== "completed") {
    throw { statusCode: 400, message: "Só é possível avaliar boleias concluídas." };
  }

  const isDriver = ride.driverId === userId;
  const isPassenger = ride.passengers.some((p) => p.id === userId);

  if (!isDriver && !isPassenger) {
    throw { statusCode: 403, message: "Não participaste nesta boleia." };
  }

  if (ride.ratedByUsers.some((u) => u.id === userId)) {
    throw { statusCode: 409, message: "Já avaliaste esta boleia." };
  }

  const ratedUser = await prisma.user.findUnique({
    where: { id: data.ratedUserId },
  });

  if (!ratedUser) {
    throw { statusCode: 404, message: "Utilizador a avaliar não encontrado." };
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
      where: { id: data.ratedUserId },
      data: {
        rating: newRating,
        totalTrips: { increment: 1 },
      },
    });
  });

  return { message: "Avaliação registada com sucesso.", newRating };
}
