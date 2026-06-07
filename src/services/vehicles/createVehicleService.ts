import { prisma } from "../../../libs/prisma";
import { randomUUID } from "crypto";
import { CreateVehicleDto } from "../../types";

export async function createVehicleService(
  data: Omit<CreateVehicleDto, "id" | "userId">,
  userId: string
) {
  const plateExists = await prisma.vehicle.findUnique({
    where: { plate: data.plate },
  });

  if (plateExists) {
    throw { statusCode: 409, message: "Matrícula já registada." };
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      id: randomUUID(),
      make: data.make,
      model: data.model,
      color: data.color,
      plate: data.plate,
      photoUrl: data.photoUrl,
      userId,
    },
  });

  return vehicle;
}
