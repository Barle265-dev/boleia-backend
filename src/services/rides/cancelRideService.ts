import { prisma } from "../../../libs/prisma";
import { randomUUID } from "crypto";

export async function cancelRideService(id: string, userId: string) {
  const ride = await prisma.ride.findUnique({
    where: { id },
    include: { passengers: { select: { id: true } } },
  });

  if (!ride) {
    throw { statusCode: 404, message: "Boleia não encontrada." };
  }

  if (ride.driverId !== userId) {
    throw { statusCode: 403, message: "Sem permissão para cancelar esta boleia." };
  }

  if (["completed", "cancelled"].includes(ride.status)) {
    throw { statusCode: 400, message: "Esta boleia já foi concluída ou cancelada." };
  }

  const updated = await prisma.ride.update({
    where: { id },
    data: { status: "cancelled" },
  });

  if (ride.passengers.length) {
    await prisma.notification.createMany({
      data: ride.passengers.map((p) => ({
        id: randomUUID(),
        userId: p.id,
        title: "Boleia cancelada",
        message: `A boleia de ${ride.origin} para ${ride.destination} foi cancelada pelo motorista.`,
        type: "system" as const,
      })),
    });
  }

  return updated;
}
