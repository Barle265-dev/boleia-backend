import { FastifyReply, FastifyRequest } from "fastify";
import { changePasswordService } from "../../services/users/changePasswordService";
import { z } from "zod";

export async function changePassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const changePasswordUserBodySchema = z.object({
    old_password: z.string(),
    new_password: z.string().min(6),
    confirm_password: z.string(),
  });

  const userId = request.user.id;

  if (!userId) {
    return reply.status(401).send({ error: "Usuário não autenticado" });
  }

  const data = changePasswordUserBodySchema.parse(request.body);
  const user = await changePasswordService(userId, data);

  return reply.status(201).send(user);
}
