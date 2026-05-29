import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { Gender, Status, User } from "types";
import { updateUserService } from "services/users/updateUserService";

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  const updateUserBodySchema = z.object({
    name: z.string().optional(),
    email: z.email().optional(),
    gender: z.enum(Gender).optional(),
    password: z.string().optional(),
    status: z.enum(Status).optional().default(Status.ACTIVE),
    phone: z.string().optional(),
    address: z.string().optional(),
    type: z.enum(User).optional(),
    roleId: z.string().optional(),
    permissionIds: z.array(z.string()).optional(),
  });

  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const { id } = paramsSchema.parse(request.params);

  const data = updateUserBodySchema.parse(request.body);
  const user = await updateUserService(id, data);

  return reply.status(201).send(user);
}
