import { db } from "@/db/client";
import { checkins } from "@/db/schema/presence/checkins";
import { events } from "@/db/schema/presence/events";
import { guests } from "@/db/schema/presence/guests";
import { users } from "@/db/schema/auth/users";
import { decrypt } from "@/lib/crypto";
import { and, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { Guest } from "@/db/schema/presence/guests";

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  offset: z.coerce.number().int().min(0).default(0),
  search: z.string().max(100).default(""),
  eventSlug: z.string().min(1, "eventSlug obrigatório"),
  guestId: z.string().optional(),
});

const createCheckinBodySchema = z.object({
  eventSlug: z.string().min(1, "eventSlug obrigatório"),
  guestId: z.string().min(1, "guestId obrigatório"),
  userId: z.string().min(1, "userId obrigatório"),
});

function decryptGuest(guest: Guest | null): Guest | null {
  if (!guest) return null;
  return {
    ...guest,
    name: decrypt(guest.name),
    document: decrypt(guest.document),
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const parsed = querySchema.safeParse({
    limit: searchParams.get("limit") ?? undefined,
    offset: searchParams.get("offset") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    eventSlug: searchParams.get("eventSlug") ?? undefined,
    guestId: searchParams.get("guestId") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parâmetros inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { limit, offset, search, eventSlug, guestId } = parsed.data;

  try {
    const [event] = await db.select({ id: events.id }).from(events).where(eq(events.slug, eventSlug));
    if (!event) {
      return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
    }

    const baseWhere = guestId
      ? and(eq(checkins.eventId, event.id), eq(checkins.guestId, guestId))
      : eq(checkins.eventId, event.id);

    const data = await db
      .select({ checkin: checkins, guest: guests, user: users })
      .from(checkins)
      .leftJoin(guests, eq(checkins.guestId, guests.id))
      .leftJoin(users, eq(checkins.userId, users.id))
      .where(baseWhere)
      .orderBy(desc(checkins.createdAt));

    const decrypted = data.map((r) => ({
      ...r.checkin,
      guest: decryptGuest(r.guest),
      user: r.user,
    }));

    const filtered = search
      ? decrypted.filter((r) =>
          r.guest?.name.toLowerCase().includes(search.toLowerCase()),
        )
      : decrypted;

    const total = filtered.length;
    const paged = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      data: paged,
      pagination: { total, limit, offset, hasMore: offset + limit < total },
    });
  } catch (error) {
    console.error("[GET /api/admin/presences/checkins]", error);
    return NextResponse.json({ error: "Erro ao buscar checkins" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const parsed = createCheckinBodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { eventSlug, guestId, userId } = parsed.data;

  try {
    const [event] = await db.select({ id: events.id }).from(events).where(eq(events.slug, eventSlug));
    if (!event) {
      return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
    }

    const [data] = await db
      .insert(checkins)
      .values({
        eventId: event.id,
        guestId,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/admin/presences/checkins]", error);
    return NextResponse.json({ error: "Erro ao registrar checkin" }, { status: 500 });
  }
}
