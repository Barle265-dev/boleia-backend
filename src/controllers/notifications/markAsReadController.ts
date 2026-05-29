import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { markAsReadService } from "../../services/notifications/markAsReadService";

export async function markAsReadController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = z.object({ id: z.uuid() }).parse(request.params);
  const notification = await markAsReadService(id, request.user.id);
  return reply.send(notification);
}
