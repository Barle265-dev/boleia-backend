import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { updateVehicleService } from "../../services/vehicles/updateVehicleService";

export async function updateVehicleController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = z.object({ id: z.uuid() }).parse(request.params);

  const schema = z.object({
    make: z.string().optional(),
    model: z.string().optional(),
    color: z.string().optional(),
    plate: z.string().optional(),
    photoUrl: z.string().url().optional(),
  });

  const data = schema.parse(request.body);
  const vehicle = await updateVehicleService(id, data, request.user.id);

  return reply.send(vehicle);
}
