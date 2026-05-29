import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { requestJoinRideService } from "../../services/rides/requestJoinRideService";

export async function requestJoinRideController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = z.object({ id: z.uuid() }).parse(request.params);
  const result = await requestJoinRideService(id, request.user.id);
  return reply.status(201).send(result);
}
