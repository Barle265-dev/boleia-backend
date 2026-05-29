import { FastifyReply, FastifyRequest } from "fastify";
import { listFretistaService } from "../../services/freights/listFretistaService";

export async function listFretistaController(request: FastifyRequest, reply: FastifyReply) {
  const fretistas = await listFretistaService();
  return reply.send(fretistas);
}
