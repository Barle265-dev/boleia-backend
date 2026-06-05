import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { updateUserService } from "services/users/updateUserService";
import { UserRole } from "types";

export async function editProfile(request: FastifyRequest, reply: FastifyReply) {
  const updateProfileBodySchema = z.object({
    name: z.string().optional(),
    email: z.email().optional(),
    photoUrl: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    role: z.enum([UserRole.PASSENGER, UserRole.DRIVER, UserRole.FRETISTA]).optional(),
  });

  const userId = request.user.id;

  if (!userId) {
    return reply.status(401).send({ error: "Usuario nao autenticado" });
  }

  const data = updateProfileBodySchema.parse(request.body);
  const user = await updateUserService(userId, data);

  return reply.status(200).send(user);
}
