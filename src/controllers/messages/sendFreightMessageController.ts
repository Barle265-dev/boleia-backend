import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { sendFreightMessageService } from "../../services/messages/sendFreightMessageService";

export async function sendFreightMessageController(request: FastifyRequest, reply: FastifyReply) {
  const { freightId } = z.object({ freightId: z.string().uuid() }).parse(request.params);

  const schema = z.object({
    text: z.string().min(1),
    recipientId: z.string().uuid(),
  });

  const data = schema.parse(request.body);
  const message = await sendFreightMessageService(freightId, data, request.user.id);

  return reply.status(201).send(message);
}
