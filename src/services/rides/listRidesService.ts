import { RideStatus } from "../../types";
import { prisma } from "../../../libs/prisma";

export async function listRidesService(filters: {
  origin?: string;
  destination?: string;
}) {
  const rides = await prisma.ride.findMany({
    where: {
      status: { in: [RideStatus.AVAILABLE, RideStatus.FULL, RideStatus.IN_PROGRESS] },
      ...(filters.origin && {
        origin: { contains: filters.origin, mode: "insensitive" },
      }),
      ...(filters.destination && {
        destination: { contains: filters.destination, mode: "insensitive" },
      }),
      departureTime: { gt: new Date() },
    },
    include: {
      driver: {
        select: { id: true, name: true, rating: true, photoUrl: true, isVerified: true },
      },
      vehicle: true,
      passengers: {
        select: { id: true, name: true, photoUrl: true, rating: true, totalTrips: true },
      },
      pendingPassengers: {
        select: { id: true, name: true, photoUrl: true, rating: true, totalTrips: true },
      },
      _count: {
        select: { passengers: true },
      },
    },
    orderBy: { departureTime: "asc" },
  });

  return rides;
}
