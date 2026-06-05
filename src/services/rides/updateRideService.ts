import { prisma } from "../../../libs/prisma";
type RideStatusValue = "available" | "full" | "in_progress" | "completed" | "cancelled";

type RideUpdatePayload = {
  origin?: string;
  destination?: string;
  departureTime?: string | Date;
  price?: number;
  observations?: string;
  status?: RideStatusValue;
};

export async function updateRideService(
  id: string,
  data: RideUpdatePayload,
  userId: string,
) {
  const ride = await prisma.ride.findUnique({ where: { id } });

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

  const updated = await prisma.ride.update({
    where: { id },
    data: {
      ...data,
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
