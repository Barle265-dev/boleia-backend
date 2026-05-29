import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { deleteVehicleService } from "../../services/vehicles/deleteVehicleService";

export async function deleteVehicleController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = z.object({ id: z.uuid() }).parse(request.params);
  await deleteVehicleService(id, request.user.id);
  return reply.status(204).send();
}
