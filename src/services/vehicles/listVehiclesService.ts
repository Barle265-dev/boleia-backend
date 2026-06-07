import { prisma } from "../../libs/prisma";

export async function listVehiclesService(userId: string) {
  const vehicles = await prisma.vehicle.findMany({
    where: { userId },
    orderBy: { make: "asc" },
  });

  return vehicles;
}
