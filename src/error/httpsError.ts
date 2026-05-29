import { AppError } from "./appError";

export function userNotFound() {
  return new AppError("Utilizador não encontrado", 404);
}
export function userFound() {
  return new AppError("Utilizador existe, tente outro", 400);
}

export function badCredentials(message = "Credenciais Inválidas") {
  return new AppError(message, 401);
}

export function notFound(message = "Recurso não encontrado") {
  return new AppError(message, 404);
}

export function badRequest(message = "Pedido inválido") {
  return new AppError(message, 400);
}

export function unauthorized(message = "Não autorizado") {
  return new AppError(message, 401);
}

export function forbidden(message = "Acesso proibido") {
  return new AppError(message, 403);
}

export function serverError(message = "Erro interno no servidor") {
  return new AppError(message, 500);
}
