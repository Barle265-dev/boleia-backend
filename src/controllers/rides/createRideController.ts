import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { createRideService } from "../../services/rides/createRideService";

export async function createRideController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const schema = z.object({
    origin: z.string(),
    destination: z.string(),
    departureTime: z.iso.datetime(),
    totalSeats: z.number().int().min(1),
    price: z.number().optional(),
    observations: z.string().optional(),
    vehicleId: z.uuid(),
  });

  const data = schema.parse(request.body);
  const ride = await createRideService(data, request.user.id);

  return reply.status(201).send(ride);
}
