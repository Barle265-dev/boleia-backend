import { prisma } from "../../../libs/prisma";

export async function rateFreightService(id: string, userId: string, rating: number) {
  const freight = await prisma.freightRequest.findUnique({
    where: { id },
  });

  if (!freight) {
    throw { statusCode: 404, message: "Pedido de frete nao encontrado." };
  }

  if (freight.status !== "completed" || !freight.fretistaId) {
    throw { statusCode: 400, message: "So e possivel avaliar fretes concluidos." };
  }

  const ratedUserId =
    userId === freight.requesterId
      ? freight.fretistaId
      : userId === freight.fretistaId
        ? freight.requesterId
        : null;

  if (!ratedUserId) {
    throw { statusCode: 403, message: "Nao fazes parte deste frete." };
  }

  const ratedUser = await prisma.user.findUnique({ where: { id: ratedUserId } });
  if (!ratedUser) {
    throw { statusCode: 404, message: "Utilizador nao encontrado." };
  }

  const denominator = Math.max(ratedUser.totalTrips, 1);
  const previousTripsForAverage = Math.max(denominator - 1, 0);
  const newRating = Number(((ratedUser.rating * previousTripsForAverage + rating) / denominator).toFixed(1));

  await prisma.user.update({
    where: { id: ratedUserId },
    data: { rating: newRating },
  });

  return { message: "Avaliacao registada com sucesso.", newRating };
}
