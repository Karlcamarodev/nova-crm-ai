// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Tomamos la URL desde .env (ya la tienes configurada)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL no está definida. Revisa tu archivo .env en la raíz del proyecto."
  );
}

// Creamos el pool de conexiones de PostgreSQL
const pool = new Pool({
  connectionString,
});

// Creamos el adapter para Prisma 7 (engineType = 'client')
const adapter = new PrismaPg(pool);

// Patrón para reutilizar una sola instancia en desarrollo (Next.js hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
