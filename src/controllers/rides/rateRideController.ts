import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { rateRideService } from "../../services/rides/rateRideService";

export async function rateRideController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = z.object({ id: z.string().uuid() }).parse(request.params);

  const schema = z.object({
    rating: z.number().min(1).max(5),
    ratedUserId: z.string().uuid(),
  });

  const data = schema.parse(request.body);
  const result = await rateRideService(id, request.user.id, data);

  return reply.send(result);
}
