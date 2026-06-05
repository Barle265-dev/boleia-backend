import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { createReadStream, existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { z } from "zod";

const uploadsDir = path.resolve(process.cwd(), "uploads");

const mimeToExtension: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
};

const extensionToMime: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  pdf: "application/pdf",
};

async function handleUpload(request: any, reply: any) {
  const schema = z.object({
    dataUrl: z.string(),
  });

  const { dataUrl } = schema.parse(request.body);
  const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp|gif)|application\/pdf);base64,(.+)$/);

  if (!match) {
    return reply.status(400).send({ message: "Ficheiro invalido. Use imagem ou PDF." });
  }

  const [, mimeType, base64] = match;
  const extension = mimeToExtension[mimeType];
  const buffer = Buffer.from(base64, "base64");

  if (buffer.length > 5 * 1024 * 1024) {
    return reply.status(400).send({ message: "O ficheiro deve ter no maximo 5MB." });
  }

  await mkdir(uploadsDir, { recursive: true });

  const fileName = `${randomUUID()}.${extension}`;
  const filePath = path.join(uploadsDir, fileName);
  await writeFile(filePath, buffer);

  const baseUrl = process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT || 3333}`;
  return reply.status(201).send({
    url: `${baseUrl}/uploads/${fileName}`,
    fileName,
    mimeType,
  });
}

export async function uploadRoutes(app: FastifyInstance) {
  app.post("/uploads/images", { bodyLimit: 8 * 1024 * 1024 }, handleUpload);
  app.post("/uploads/files", { bodyLimit: 8 * 1024 * 1024 }, handleUpload);

  app.get("/uploads/:fileName", async (request, reply) => {
    const paramsSchema = z.object({
      fileName: z.string().regex(/^[a-f0-9-]+\.(jpg|png|webp|gif|pdf)$/i),
    });

    const { fileName } = paramsSchema.parse(request.params);
    const filePath = path.join(uploadsDir, fileName);
    const extension = path.extname(fileName).slice(1).toLowerCase();
    const mimeType = extensionToMime[extension];

    if (!existsSync(filePath)) {
      return reply.status(404).send({ message: "Ficheiro nao encontrado." });
    }

    return reply.header("Content-Type", mimeType).send(createReadStream(filePath));
  });
}
