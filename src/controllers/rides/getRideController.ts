import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getRideService } from "../../services/rides/getRideService";

export async function getRideController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = z.object({ id: z.uuid() }).parse(request.params);
  const ride = await getRideService(id);
  return reply.send(ride);
}
