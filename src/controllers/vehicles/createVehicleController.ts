import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { createVehicleService } from "../../services/vehicles/createVehicleService";

export async function createVehicleController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const schema = z.object({
    make: z.string(),
    model: z.string(),
    color: z.string(),
    plate: z.string(),
    photoUrl: z.url().optional(),
  });

  const data = schema.parse(request.body);
  const vehicle = await createVehicleService(data, request.user.id);

  return reply.status(201).send(vehicle);
}
