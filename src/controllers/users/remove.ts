import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { removeUserService } from "services/users/removeUserService";

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const { id } = paramsSchema.parse(request.params);
  const user = await removeUserService(id);

  return reply.status(201).send(user);
}
