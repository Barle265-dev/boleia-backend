import { prisma } from "../../../libs/prisma";
import { UpdateVehicleDto } from "types";

export async function updateVehicleService(
  id: string,
  data: Omit<UpdateVehicleDto, "id" | "userId">,
  userId: string
) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });

  if (!vehicle) {
    throw { statusCode: 404, message: "Veículo não encontrado." };
  }

  if (vehicle.userId !== userId) {
    throw { statusCode: 403, message: "Sem permissão para editar este veículo." };
  }

  if (data.plate && data.plate !== vehicle.plate) {
    const plateExists = await prisma.vehicle.findUnique({
      where: { plate: data.plate },
    });
    if (plateExists) {
      throw { statusCode: 409, message: "Matrícula já registada." };
    }
  }

  const updated = await prisma.vehicle.update({
    where: { id },
    data,
  });

  return updated;
}
