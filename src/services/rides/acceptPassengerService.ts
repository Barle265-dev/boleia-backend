import { prisma } from "../../../libs/prisma";
import { randomUUID } from "crypto";

export async function acceptPassengerService(
  rideId: string,
  passengerId: string,
  userId: string
) {
  const ride = await prisma.ride.findUnique({
    where: { id: rideId },
    include: { pendingPassengers: { select: { id: true } } },
  });

  if (!ride) {
    throw { statusCode: 404, message: "Boleia não encontrada." };
  }

  if (ride.driverId !== userId) {
    throw { statusCode: 403, message: "Só o motorista pode aceitar passageiros." };
  }

  if (!ride.pendingPassengers.some((p) => p.id === passengerId)) {
    throw { statusCode: 404, message: "Este utilizador não tem pedido pendente nesta boleia." };
  }

  const updated = await prisma.$transaction(async (tx) => {
    const current = await tx.ride.findUnique({ where: { id: rideId } });

    if (!current || current.availableSeats <= 0) {
      throw { statusCode: 400, message: "Não há vagas disponíveis." };
    }

    const newAvailableSeats = current.availableSeats - 1;
    const newStatus = newAvailableSeats === 0 ? "full" : current.status;

    const updatedRide = await tx.ride.update({
      where: { id: rideId },
      data: {
        availableSeats: newAvailableSeats,
        status: newStatus,
        pendingPassengers: { disconnect: { id: passengerId } },
        passengers: { connect: { id: passengerId } },
      },
    });

    await tx.notification.create({
      data: {
        id: randomUUID(),
        userId: passengerId,
        title: "Pedido aceite!",
        message: `O teu pedido para a boleia de ${ride.origin} para ${ride.destination} foi aceite.`,
        type: "confirmation",
      },
    });

    return updatedRide;
  });

  return updated;
}
