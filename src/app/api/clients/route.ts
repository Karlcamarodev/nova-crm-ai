// src/app/api/clients/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

// Esquema de validación para creación de clientes
const createClientSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z
    .string()
    .email({ message: "Email inválido." })
    .optional()
    .or(z.literal("").transform(() => undefined)),
  company: z
    .string()
    .max(100, { message: "El nombre de la empresa es muy largo." })
    .optional()
    .or(z.literal("").transform(() => undefined)),
  notes: z
    .string()
    .max(500, { message: "Las notas no pueden exceder 500 caracteres." })
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

/**
 * GET /api/clients
 * Lista los clientes.
 */
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: clients });
  } catch (error) {
    console.error("GET /api/clients error:", error);
    return NextResponse.json(
      { error: "Error al obtener los clientes." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/clients
 * Crea un nuevo cliente.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createClientSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Datos inválidos." },
        { status: 400 }
      );
    }

    // Campos validados por Zod
    const { name, email, company, notes } = parsed.data;

    const newClient = await prisma.client.create({
      data: {
        name,
        email,
        company,
        notes,
        status: "ACTIVE",
        // ownerId opcional: aún no lo usamos
      },
    });

    return NextResponse.json({ data: newClient }, { status: 201 });
  } catch (error) {
    console.error("POST /api/clients error:", error);
    return NextResponse.json(
      { error: "Error al crear el cliente." },
      { status: 500 }
    );
  }
}
