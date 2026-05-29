import { prisma } from "../../../libs/prisma";
import { randomUUID } from "crypto";

export async function sendRideMessageService(
  rideId: string,
  text: string,
  userId: string
) {
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

  if (["cancelled", "completed"].includes(ride.status)) {
    throw { statusCode: 400, message: "Não é possível enviar mensagens numa boleia encerrada." };
  }

  const message = await prisma.message.create({
    data: {
      id: randomUUID(),
      text,
      senderId: userId,
      rideId,
    },
    include: {
      sender: {
        select: { id: true, name: true, photoUrl: true },
      },
    },
  });

  return message;
}
