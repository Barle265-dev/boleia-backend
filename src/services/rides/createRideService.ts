import { prisma } from "../../../libs/prisma";
import { randomUUID } from "crypto";
import { CreateRideDto, RideStatus } from "../../types";

export async function createRideService(
  data: Omit<CreateRideDto, "id" | "driverId" | "availableSeats" | "status">,
  userId: string,
) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: data.vehicleId },
  });

  if (!vehicle) {
    throw { statusCode: 404, message: "Veículo não encontrado." };
  }

  if (vehicle.userId !== userId) {
    throw { statusCode: 403, message: "Este veículo não te pertence." };
  }

  const departureTime = new Date(data.departureTime);
  if (departureTime <= new Date()) {
    throw { statusCode: 400, message: "A data de partida deve ser no futuro." };
  }

  const ride = await prisma.ride.create({
    data: {
      id: randomUUID(),
      origin: data.origin,
      destination: data.destination,
      departureTime,
      totalSeats: data.totalSeats,
      availableSeats: data.totalSeats,
      price: data.price,
      observations: data.observations,
      vehicleId: data.vehicleId,
      driverId: userId,
      status: RideStatus.AVAILABLE,
    },
    include: {
      vehicle: true,
      driver: {
        select: { id: true, name: true, rating: true, photoUrl: true },
      },
    },
  });

  return ride;
}
