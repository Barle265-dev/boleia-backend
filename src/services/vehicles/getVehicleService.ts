import { prisma } from "../../libs/prisma";

export async function getVehicleService(id: string, userId: string) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
  });

  if (!vehicle) {
    throw { statusCode: 404, message: "Veículo não encontrado." };
  }

  if (vehicle.userId !== userId) {
    throw {
      statusCode: 403,
      message: "Sem permissão para aceder a este veículo.",
    };
  }

  return vehicle;
}
