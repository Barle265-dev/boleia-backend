import { FastifyReply, FastifyRequest } from "fastify";
import { fetchAllUsersService } from "services/users/fetchAllUsersService";
import { zodFilterSchema } from "tools/fetch-params";
import { User } from "types";
import z from "zod";

export async function fetchAllUsers(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const querySchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    type: z
      .string()
      .transform((type) => {
        const stringToList = type.split(";");
        const list = stringToList
          .filter((type) => type)
          .map((type) => type as User);
        return list;
      })
      .optional(),
    ...zodFilterSchema,
    sorterBy: z.enum(["name", "email"]).optional().default("name"),
    role: z
      .string()
      .transform((value) => value.split(";").filter(Boolean))
      .optional(),
  });

  const data = querySchema.parse(request.query);

  const result = await fetchAllUsersService(data);

  return reply.status(200).send(result);
}
