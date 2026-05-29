import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { registerService } from "../../services/users/userServices";
import { UserRole } from "types";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string().min(6),
    phone: z.string().optional(),
    role: z
      .enum([UserRole.PASSENGER, UserRole.FRETISTA])
      .default(UserRole.PASSENGER),
  });

  const data = bodySchema.parse(request.body);
  const user = await registerService(data);

  return reply.status(201).send(user);
}
