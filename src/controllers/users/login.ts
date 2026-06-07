import { FastifyReply, FastifyRequest } from "fastify";
import { loginService } from "../../services/users/loginService";
import z from "zod";

export async function loginController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const loginUserBodySchema = z.object({
    email: z.email(),
    password: z.string(),
  });

  const data = loginUserBodySchema.parse(request.body);
  const user = await loginService(data);

  const token = await reply.jwtSign(
    {},
    {
      sign: {
        sub: user.id,
        expiresIn: "8hr",
      },
    }
  );

  return reply.send({
    message: "Login efetuado",
    token,
    user,
  });
}
