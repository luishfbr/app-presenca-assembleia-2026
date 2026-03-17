import { db } from "@/db/client";
import { checkins } from "@/db/schema/presence/checkins";
import { events } from "@/db/schema/presence/events";
import { guests } from "@/db/schema/presence/guests";
import { eventUsers } from "@/db/schema/presence/event-users";
import { decrypt, hashForSearch } from "@/lib/crypto";
import { getServerSession } from "@/server/session";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { Guest } from "@/db/schema/presence/guests";

function decryptGuest(guest: Guest): Guest {
  return {
    ...guest,
    name: decrypt(guest.name),
    document: decrypt(guest.document),
  };
}

const lookupSchema = z.object({
  document: z.string().regex(/^\d{11}$/, "Documento inválido"),
  eventSlug: z.string().min(1, "eventSlug obrigatório"),
});

const registerSchema = z.object({
  guestId: z.string().min(1),
  eventSlug: z.string().min(1, "eventSlug obrigatório"),
});

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const parsed = lookupSchema.safeParse({
    document: request.nextUrl.searchParams.get("document") ?? "",
    eventSlug: request.nextUrl.searchParams.get("eventSlug") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parâmetros inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { document, eventSlug } = parsed.data;

  const [event] = await db.select({ id: events.id }).from(events).where(eq(events.slug, eventSlug));
  if (!event) {
    return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
  }

  const eventId = event.id;

  // Verificar se o usuário tem acesso ao evento
  const access = await db.query.eventUsers.findFirst({
    where: and(
      eq(eventUsers.eventId, eventId),
      eq(eventUsers.userId, session.user.id),
    ),
  });

  if (!access) {
    return NextResponse.json({ error: "Acesso negado a este evento" }, { status: 403 });
  }

  try {
    const guest = await db.query.guests.findFirst({
      where: and(
        eq(guests.documentHash, hashForSearch(document)),
        eq(guests.eventId, eventId),
      ),
    });

    if (!guest) {
      return NextResponse.json({ error: "Convidado não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data: decryptGuest(guest) }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/presences/checkin]", error);
    return NextResponse.json({ error: "Erro ao buscar convidado" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { guestId, eventSlug: postEventSlug } = parsed.data;

  const [postEvent] = await db.select({ id: events.id }).from(events).where(eq(events.slug, postEventSlug));
  if (!postEvent) {
    return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
  }

  const postEventId = postEvent.id;

  // Verificar acesso ao evento
  const access = await db.query.eventUsers.findFirst({
    where: and(
      eq(eventUsers.eventId, postEventId),
      eq(eventUsers.userId, session.user.id),
    ),
  });

  if (!access) {
    return NextResponse.json({ error: "Acesso negado a este evento" }, { status: 403 });
  }

  try {
    const existing = await db.query.checkins.findFirst({
      where: and(eq(checkins.guestId, guestId), eq(checkins.eventId, postEventId)),
    });

    if (existing) {
      return NextResponse.json(
        { error: "Presença já registrada para este convidado" },
        { status: 409 },
      );
    }

    const [data] = await db
      .insert(checkins)
      .values({
        guestId,
        eventId: postEventId,
        userId: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/presences/checkin]", error);
    return NextResponse.json({ error: "Erro ao registrar presença" }, { status: 500 });
  }
}
