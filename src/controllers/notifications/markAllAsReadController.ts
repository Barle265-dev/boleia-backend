import { FastifyReply, FastifyRequest } from "fastify";
import { markAllAsReadService } from "../../services/notifications/markAllAsReadService";

export async function markAllAsReadController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await markAllAsReadService(request.user.id);
  return reply.status(204).send();
}
