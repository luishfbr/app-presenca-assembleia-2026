import { db } from "@/db/client";
import { checkins } from "@/db/schema/presence/checkins";
import { events } from "@/db/schema/presence/events";
import { guests } from "@/db/schema/presence/guests";
import { decrypt, encrypt, hashForSearch } from "@/lib/crypto";
import { paginationSchema, type PaginationParams } from "@/lib/api-utils";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import type { Guest } from "@/db/schema/presence/guests";
import { z } from "zod";

/** Descriptografa name e document de um registro bruto do banco. */
function decryptGuest(guest: Guest): Guest {
  return {
    ...guest,
    name: decrypt(guest.name),
    document: decrypt(guest.document),
  };
}

const querySchema = paginationSchema.extend({
  eventSlug: z.string().min(1, "eventSlug obrigatório"),
});

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const parsed = querySchema.safeParse({
    limit: searchParams.get("limit") ?? undefined,
    offset: searchParams.get("offset") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    eventSlug: searchParams.get("eventSlug") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parâmetros inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { limit, offset, search, eventSlug } = parsed.data as PaginationParams & {
    eventSlug: string;
  };

  try {
    const [event] = await db.select({ id: events.id }).from(events).where(eq(events.slug, eventSlug));
    if (!event) {
      return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
    }

    // Busca todos os registros do evento — filtro de texto feito em memória após descriptografar
    const rows = await db.query.guests.findMany({
      where: eq(guests.eventId, event.id),
      orderBy: [desc(guests.createdAt)],
    });

    const decrypted = rows.map(decryptGuest);

    const filtered = search
      ? decrypted.filter(
          (g) =>
            g.name.toLowerCase().includes(search.toLowerCase()) ||
            g.document.toLowerCase().includes(search.toLowerCase()),
        )
      : decrypted;

    const total = filtered.length;
    const data = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      data,
      pagination: { total, limit, offset, hasMore: offset + limit < total },
    });
  } catch (error) {
    console.error("[GET /api/admin/presences/guests]", error);
    return NextResponse.json({ error: "Erro ao buscar convidados" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const eventSlug = request.nextUrl.searchParams.get("eventSlug");

  if (!eventSlug) {
    return NextResponse.json({ error: "eventSlug obrigatório" }, { status: 400 });
  }

  try {
    const [event] = await db.select({ id: events.id }).from(events).where(eq(events.slug, eventSlug));
    if (!event) {
      return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
    }

    await db.transaction(async (tx) => {
      await tx.delete(checkins).where(eq(checkins.eventId, event.id));
      await tx.delete(guests).where(eq(guests.eventId, event.id));
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/admin/presences/guests]", error);
    return NextResponse.json({ error: "Erro ao excluir convidados" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const guestBodySchema = z.object({
    eventSlug: z.string().min(1, "eventSlug obrigatório"),
    name: z.string().min(1, "name obrigatório"),
    document: z.string().min(1, "document obrigatório"),
    type: z.string().min(1, "type obrigatório"),
  });

  const parsed = guestBodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { eventSlug: postEventSlug, name, document: doc, type } = parsed.data;

  try {
    const [event] = await db.select({ id: events.id }).from(events).where(eq(events.slug, postEventSlug));
    if (!event) {
      return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
    }

    const [data] = await db
      .insert(guests)
      .values({
        eventId: event.id,
        name: encrypt(name),
        document: encrypt(doc),
        documentHash: hashForSearch(doc),
        type,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({ data: decryptGuest(data) }, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/admin/presences/guests]", error);

    if (error?.code === "23505") {
      return NextResponse.json(
        { error: "Documento já cadastrado neste evento" },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: "Erro ao criar convidado" }, { status: 500 });
  }
}
