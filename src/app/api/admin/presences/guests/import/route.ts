import { db } from "@/db/client";
import { events } from "@/db/schema/presence/events";
import { guests, insertGuestSchema } from "@/db/schema/presence/guests";
import { encrypt, hashForSearch } from "@/lib/crypto";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const importBodySchema = z.object({
  eventSlug: z.string().min(1, "eventSlug obrigatório"),
  guests: z
    .array(
      z.object({
        name: z.string().trim().min(1),
        document: z.string().trim().min(1),
        type: z.string().trim().min(1),
      }),
    )
    .min(1, "Nenhum convidado para importar"),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const parsed = importBodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { eventSlug, guests: rows } = parsed.data;
  const now = new Date();

  let eventId: string;
  try {
    const [event] = await db.select({ id: events.id }).from(events).where(eq(events.slug, eventSlug));
    if (!event) {
      return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
    }
    eventId = event.id;
  } catch (error) {
    console.error("[POST /api/admin/presences/guests/import]", error);
    return NextResponse.json({ error: "Erro ao importar convidados" }, { status: 500 });
  }

  // Separar linhas inválidas antes do insert
  const validationErrors: { row: number; document: string; reason: string }[] = [];
  const validRows: { name: string; document: string; type: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const result = insertGuestSchema.safeParse({ ...rows[i], eventId });
    if (!result.success) {
      validationErrors.push({
        row: i + 1,
        document: rows[i].document,
        reason: "Dados inválidos: " + result.error.issues.map((e) => e.message).join(", "),
      });
    } else {
      validRows.push(rows[i]);
    }
  }

  if (validRows.length === 0) {
    return NextResponse.json(
      { inserted: 0, duplicates: 0, errors: validationErrors },
      { status: 200 },
    );
  }

  try {
    const insertValues = validRows.map((row) => ({
      eventId,
      name: encrypt(row.name),
      document: encrypt(row.document),
      documentHash: hashForSearch(row.document),
      type: row.type,
      createdAt: now,
      updatedAt: now,
    }));

    const insertedRows = await db
      .insert(guests)
      .values(insertValues)
      .onConflictDoNothing()
      .returning({ documentHash: guests.documentHash });

    const insertedHashes = new Set(insertedRows.map((r) => r.documentHash));
    const inserted = insertedRows.length;

    const duplicateErrors = validRows
      .map((row) => ({ row, originalIndex: rows.indexOf(row) + 1, hash: hashForSearch(row.document) }))
      .filter(({ hash }) => !insertedHashes.has(hash))
      .map(({ row, originalIndex }) => ({
        row: originalIndex,
        document: row.document,
        reason: "Documento já cadastrado neste evento",
      }));

    const duplicates = duplicateErrors.length;
    const errors = [...validationErrors, ...duplicateErrors];

    return NextResponse.json({ inserted, duplicates, errors }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/admin/presences/guests/import]", error);
    return NextResponse.json({ error: "Erro ao importar convidados" }, { status: 500 });
  }
}
