import { FastifyReply, FastifyRequest } from "fastify";
import { listVehiclesService } from "../../services/vehicles/listVehiclesService";

export async function listVehiclesController(request: FastifyRequest, reply: FastifyReply) {
  const vehicles = await listVehiclesService(request.user.id);
  return reply.send(vehicles);
}
