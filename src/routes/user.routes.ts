import { FastifyInstance } from "fastify";
import { register } from "../controllers/users/register";
import { fetchAllUsers } from "controllers/users/fetchAll";
import { remove } from "controllers/users/remove";
import { updateUser } from "controllers/users/update";
import { loginController } from "controllers/users/login";
import { changePassword } from "controllers/users/changePassword";
import { profile } from "controllers/users/profile";
import { checkPermissions, verifyJWT } from "middware/verify-jwt";
import { Permissions } from "permissionsTypes";
import { findByIdUser } from "controllers/users/findById";
import { editProfile } from "controllers/users/editProfile";
import { prisma } from "../../libs/prisma";
import { randomUUID } from "crypto";
import { z } from "zod";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post("/register", register);
  fastify.post("/login", loginController);

  fastify.get(
    "/users",
    {
      preHandler: [verifyJWT],
    },
    fetchAllUsers,
  );
  fastify.get(
    "/user/:id",
    {
      preHandler: [verifyJWT],
    },
    findByIdUser,
  );
  fastify.put(
    "/user/:id",
    {
      preHandler: [verifyJWT, checkPermissions([Permissions.admin_role])],
    },
    updateUser,
  );
  fastify.put(
    "/remove-user/:id",
    {
      preHandler: [verifyJWT, checkPermissions([Permissions.admin_role])],
    },
    remove,
  );

  fastify.put("/change-password", { preHandler: [verifyJWT] }, changePassword);
  fastify.get("/me", { preHandler: [verifyJWT] }, profile);
  fastify.put("/me", { preHandler: [verifyJWT] }, editProfile);
  fastify.post("/me/documents", { preHandler: [verifyJWT] }, async (request, reply) => {
    const schema = z.object({
      nationalIdUrl: z.string().url(),
      drivingLicenseUrl: z.string().url().optional(),
    });

    const data = schema.parse(request.body);
    const documents = [
      {
        id: randomUUID(),
        name: "Bilhete de Identidade / CNI",
        type: "national_id" as const,
        url: data.nationalIdUrl,
        status: "pending" as const,
        userId: request.user.id,
      },
      ...(data.drivingLicenseUrl
        ? [{
            id: randomUUID(),
            name: "Carta de Conducao",
            type: "driving_license" as const,
            url: data.drivingLicenseUrl,
            status: "pending" as const,
            userId: request.user.id,
          }]
        : []),
    ];

    await prisma.$transaction([
      prisma.userDocument.deleteMany({
        where: {
          userId: request.user.id,
          type: { in: ["national_id", "driving_license"] },
        },
      }),
      prisma.userDocument.createMany({ data: documents }),
      prisma.user.update({
        where: { id: request.user.id },
        data: { isVerified: false },
      }),
    ]);

    return reply.status(201).send(documents);
  });
}
