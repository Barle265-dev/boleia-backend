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
}
