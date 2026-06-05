import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { rateFreightService } from "services/freights/rateFreightService";

export async function rateFreightController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
  const data = z.object({ rating: z.number().min(1).max(5) }).parse(request.body);
  const result = await rateFreightService(id, request.user.id, data.rating);
  return reply.send(result);
}
