import { prisma } from "../../../libs/prisma";
type RideStatusValue = "available" | "full" | "in_progress" | "completed" | "cancelled";

type RideUpdatePayload = {
  origin?: string;
  destination?: string;
  departureTime?: string | Date;
  totalSeats?: number;
  price?: number;
  observations?: string;
  vehicleId?: string;
  status?: RideStatusValue;
};

export async function updateRideService(
  id: string,
  data: RideUpdatePayload,
  userId: string,
) {
  const ride = await prisma.ride.findUnique({
    where: { id },
    include: {
      passengers: { select: { id: true } },
    },
  });

  if (!ride) {
    throw { statusCode: 404, message: "Boleia nao encontrada." };
  }

  if (ride.driverId !== userId) {
    throw { statusCode: 403, message: "Sem permissao para editar esta boleia." };
  }

  if (ride.status !== "available" && !data.status) {
    throw { statusCode: 400, message: "So e possivel editar boleias disponiveis." };
  }

  if (data.departureTime) {
    const departureTime = new Date(data.departureTime);
    if (departureTime <= new Date()) {
      throw { statusCode: 400, message: "A data de partida deve ser no futuro." };
    }
  }

  if (data.vehicleId) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: data.vehicleId },
    });

    if (!vehicle) {
      throw { statusCode: 404, message: "Veiculo nao encontrado." };
    }

    if (vehicle.userId !== userId) {
      throw { statusCode: 403, message: "Este veiculo nao te pertence." };
    }
  }

  const occupiedSeats = ride.passengers.length;
  if (data.totalSeats !== undefined && data.totalSeats < occupiedSeats) {
    throw {
      statusCode: 400,
      message: "O numero de lugares nao pode ser inferior aos passageiros confirmados.",
    };
  }

  const availableSeats =
    data.totalSeats !== undefined ? data.totalSeats - occupiedSeats : undefined;

  const updated = await prisma.ride.update({
    where: { id },
    data: {
      ...data,
      ...(availableSeats !== undefined && { availableSeats }),
      ...(data.departureTime && {
        departureTime: new Date(data.departureTime),
      }),
    },
    include: {
      driver: { select: { id: true, name: true, rating: true, photoUrl: true, isVerified: true } },
      vehicle: true,
      passengers: { select: { id: true, name: true, photoUrl: true, rating: true } },
      pendingPassengers: { select: { id: true, name: true, photoUrl: true } },
    },
  });

  return updated;
}
