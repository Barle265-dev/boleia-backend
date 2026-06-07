import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { findUserByIdService } from "../../services/users/findUserByIdService";

export async function findByIdUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const { id } = paramsSchema.parse(request.params);

  const user = await findUserByIdService(id);

  return reply.status(201).send(user);
}
