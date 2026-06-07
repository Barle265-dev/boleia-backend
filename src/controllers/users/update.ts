import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UserRole } from "../../types";
import { updateUserService } from "../../services/users/updateUserService";

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  const updateUserBodySchema = z.object({
    name: z.string().optional(),
    email: z.email().optional(),
    password: z.string().optional(),
    phone: z.string().optional().nullable(),
    photoUrl: z.string().optional().nullable(),
    role: z.enum([UserRole.PASSENGER, UserRole.DRIVER, UserRole.FRETISTA]).optional(),
    isVerified: z.boolean().optional(),
    isBlocked: z.boolean().optional(),
    permissionIds: z.array(z.string()).optional(),
  });

  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const { id } = paramsSchema.parse(request.params);
  const data = updateUserBodySchema.parse(request.body);
  const user = await updateUserService(id, data);

  return reply.status(200).send(user);
}
