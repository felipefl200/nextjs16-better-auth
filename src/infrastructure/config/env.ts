const DEFAULT_API_URL = "http://localhost:3001";

function readApiUrl(): string {
  const value = process.env.API_URL || DEFAULT_API_URL;

  try {
    new URL(value);
  } catch {
    throw new Error(`API_URL inválida: "${value}"`);
  }

  return value.replace(/\/+$/, "");
}

/** URL base do backend NestJS / Better Auth (somente servidor). */
export const API_URL = readApiUrl();
