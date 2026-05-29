import { FastifyReply, FastifyRequest } from "fastify";
import { listNotificationsService } from "../../services/notifications/listNotificationsService";

export async function listNotificationsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const notifications = await listNotificationsService(request.user.id);
  return reply.send(notifications);
}
