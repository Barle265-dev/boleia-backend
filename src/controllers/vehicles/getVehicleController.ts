import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getVehicleService } from "../../services/vehicles/getVehicleService";

export async function getVehicleController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = z.object({ id: z.uuid() }).parse(request.params);
  const vehicle = await getVehicleService(id, request.user.id);
  return reply.send(vehicle);
}
