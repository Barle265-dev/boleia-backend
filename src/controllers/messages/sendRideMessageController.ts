import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { sendRideMessageService } from "../../services/messages/sendRideMessageService";

export async function sendRideMessageController(request: FastifyRequest, reply: FastifyReply) {
  const { rideId } = z.object({ rideId: z.string().uuid() }).parse(request.params);

  const schema = z.object({
    text: z.string().min(1),
  });

  const { text } = schema.parse(request.body);
  const message = await sendRideMessageService(rideId, text, request.user.id);

  return reply.status(201).send(message);
}
