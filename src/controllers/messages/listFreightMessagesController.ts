import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { listFreightMessagesService } from "../../services/messages/listFreightMessagesService";

export async function listFreightMessagesController(request: FastifyRequest, reply: FastifyReply) {
  const { freightId } = z.object({ freightId: z.string().uuid() }).parse(request.params);
  const messages = await listFreightMessagesService(freightId, request.user.id);
  return reply.send(messages);
}
