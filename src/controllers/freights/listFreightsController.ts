import { FastifyReply, FastifyRequest } from "fastify";
import { listFreightsService } from "../../services/freights/listFreightsService";

export async function listFreightsController(request: FastifyRequest, reply: FastifyReply) {
  const freights = await listFreightsService(request.user.id);
  return reply.send(freights);
}
