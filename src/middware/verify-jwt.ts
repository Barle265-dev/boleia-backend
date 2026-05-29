import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../libs/prisma";

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    const payload = await request.jwtVerify<{ sub: string }>();

    const user = await prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
      include: {
        Permissions: {
          include: {
            Permission: true,
          },
        },
      },
    });

    if (!user) {
      return reply.code(401).send({ error: "Usuário não encontrado" });
    }

    const permissions =
      user.Permissions?.map((item) => item.Permission.name) ?? [];

    request.user = { id: user.id, permissions };
  } catch (error) {
    return reply.status(401).send({ message: "Não autorizado." });
  }
}

export function checkPermissions(requiredPermissions: string[]) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const userPermissions = request.user.permissions;

    const hasPermission = requiredPermissions.every((p) =>
      userPermissions.includes(p),
    );
    if (!hasPermission) {
      return reply.code(403).send({ error: "Permissão negada" });
    }
  };
}
