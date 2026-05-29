import { prisma } from "../../../libs/prisma";
import { UpdateRideDto } from "types";

export async function updateRideService(
  id: string,
  data: Partial<
    Pick<
      UpdateRideDto,
      "origin" | "destination" | "departureTime" | "price" | "observations"
    >
  >,
  userId: string,
) {
  const ride = await prisma.ride.findUnique({ where: { id } });

  if (!ride) {
    throw { statusCode: 404, message: "Boleia não encontrada." };
  }

  if (ride.driverId !== userId) {
    throw {
      statusCode: 403,
      message: "Sem permissão para editar esta boleia.",
    };
  }

  if (ride.status !== "available") {
    throw {
      statusCode: 400,
      message: "Só é possível editar boleias com status 'available'.",
    };
  }

  if (data.departureTime) {
    const departureTime = new Date(data.departureTime);
    if (departureTime <= new Date()) {
      throw {
        statusCode: 400,
        message: "A data de partida deve ser no futuro.",
      };
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
  });

  return updated;
}
