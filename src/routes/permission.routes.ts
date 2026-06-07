import { FastifyInstance } from "fastify";
import { fetchAllPermissionsService } from "../services/permissions/fetchAllRolesService";

export async function permissionRoutes(app: FastifyInstance) {
  app.get("/permissions", async () => fetchAllPermissionsService());
}
