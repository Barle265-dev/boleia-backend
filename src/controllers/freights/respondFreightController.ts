import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { respondFreightService } from "../../services/freights/respondFreightService";

export async function respondFreightController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = z.object({ id: z.string().uuid() }).parse(request.params);

  const schema = z.object({
    action: z.enum(["accepted", "declined"]),
  });

  const { action } = schema.parse(request.body);
  const freight = await respondFreightService(id, action, request.user.id);

  return reply.send(freight);
}
