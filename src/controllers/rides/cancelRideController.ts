import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { cancelRideService } from "../../services/rides/cancelRideService";

export async function cancelRideController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = z.object({ id: z.uuid() }).parse(request.params);
  const ride = await cancelRideService(id, request.user.id);
  return reply.send(ride);
}
