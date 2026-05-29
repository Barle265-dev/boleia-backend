import { FastifyReply, FastifyRequest } from "fastify";
import { profileService } from "services/users/profileService";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.id;

  if (!userId) {
    return reply.status(401).send({ error: "Usuário não autenticado" });
  }
  const users = await profileService(userId);

  return reply.status(200).send(users);
}
