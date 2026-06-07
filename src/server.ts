import fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";

import fastifyJwt from "@fastify/jwt";
import { appRoutes } from "routes";
dotenv.config();
const PORT = Number(process.env.PORT) || 4444;

async function start() {
  const app = fastify({ logger: true });

  await app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  });
  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "default_super_secret_key",
  });
  await app.register(appRoutes);

  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
