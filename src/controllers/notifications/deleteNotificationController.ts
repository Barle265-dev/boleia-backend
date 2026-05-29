import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { deleteNotificationService } from "../../services/notifications/deleteNotificationService";

export async function deleteNotificationController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = z.object({ id: z.uuid() }).parse(request.params);
  await deleteNotificationService(id, request.user.id);
  return reply.status(204).send();
}
