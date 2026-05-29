import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { createFreightService } from "../../services/freights/createFreightService";

export async function createFreightController(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    origin: z.string(),
    destination: z.string(),
    requestedTime: z.string().datetime().optional(),
    fretistaId: z.string().uuid(),
  });

  const data = schema.parse(request.body);
  const freight = await createFreightService(data, request.user.id);

  return reply.status(201).send(freight);
}
