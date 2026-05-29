import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getFreightService } from "../../services/freights/getFreightService";

export async function getFreightController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
  const freight = await getFreightService(id, request.user.id);
  return reply.send(freight);
}
