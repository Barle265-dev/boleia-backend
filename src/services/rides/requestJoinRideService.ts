import { prisma } from "../../../libs/prisma";
import { randomUUID } from "crypto";

export async function requestJoinRideService(rideId: string, userId: string) {
  const ride = await prisma.ride.findUnique({
    where: { id: rideId },
    include: {
      passengers: { select: { id: true } },
      pendingPassengers: { select: { id: true } },
    },
  });

  if (!ride) {
    throw { statusCode: 404, message: "Boleia não encontrada." };
  }

  if (ride.driverId === userId) {
    throw { statusCode: 400, message: "Não podes inscrever-te na tua própria boleia." };
  }

  if (ride.status !== "available") {
    throw { statusCode: 400, message: "Esta boleia não está disponível." };
  }

  if (ride.availableSeats <= 0) {
    throw { statusCode: 400, message: "Não há vagas disponíveis." };
  }

  if (ride.passengers.some((p) => p.id === userId)) {
    throw { statusCode: 409, message: "Já és passageiro desta boleia." };
  }

  if (ride.pendingPassengers.some((p) => p.id === userId)) {
    throw { statusCode: 409, message: "Já tens um pedido pendente para esta boleia." };
  }

  await prisma.ride.update({
    where: { id: rideId },
    data: { pendingPassengers: { connect: { id: userId } } },
  });

  await prisma.notification.create({
    data: {
      id: randomUUID(),
      userId: ride.driverId,
      title: "Novo pedido de boleia",
      message: `Um utilizador quer entrar na tua boleia de ${ride.origin} para ${ride.destination}.`,
      type: "request",
    },
  });

  return { message: "Pedido enviado com sucesso." };
}
