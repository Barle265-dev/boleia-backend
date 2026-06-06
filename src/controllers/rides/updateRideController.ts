import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { updateRideService } from "../../services/rides/updateRideService";

export async function updateRideController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = z.object({ id: z.string().uuid() }).parse(request.params);

  const schema = z.object({
    origin: z.string().optional(),
    destination: z.string().optional(),
    departureTime: z.iso.datetime().optional(),
    totalSeats: z.number().int().min(1).optional(),
    price: z.number().optional(),
    observations: z.string().optional(),
    vehicleId: z.uuid().optional(),
    status: z.enum(["available", "full", "in_progress", "completed", "cancelled"]).optional(),
  });

  const data = schema.parse(request.body);
  const ride = await updateRideService(id, data, request.user.id);

  return reply.send(ride);
}
