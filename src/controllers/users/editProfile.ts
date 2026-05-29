import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { Gender, Status, User } from "types";
import { updateUserService } from "services/users/updateUserService";

export async function editProfile(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const updateProfileBodySchema = z.object({
    name: z.string().optional(),
    email: z.email().optional(),
    gender: z.enum(Gender).optional(),
    phone: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
  });

  const userId = request.user.id;

  if (!userId) {
    return reply.status(401).send({ error: "Usuário não autenticado" });
  }

  const data = updateProfileBodySchema.parse(request.body);
  const user = await updateUserService(userId, data);

  return reply.status(201).send(user);
}
