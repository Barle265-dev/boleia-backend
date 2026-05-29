import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { listRideMessagesService } from "../../services/messages/listRideMessagesService";

export async function listRideMessagesController(request: FastifyRequest, reply: FastifyReply) {
  const { rideId } = z.object({ rideId: z.string().uuid() }).parse(request.params);
  const messages = await listRideMessagesService(rideId, request.user.id);
  return reply.send(messages);
}
