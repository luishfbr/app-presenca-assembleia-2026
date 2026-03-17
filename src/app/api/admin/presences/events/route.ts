import { db } from "@/db/client";
import { events } from "@/db/schema/presence/events";
import { guests } from "@/db/schema/presence/guests";
import { checkins } from "@/db/schema/presence/checkins";
import { paginationSchema, type PaginationParams } from "@/lib/api-utils";
import { generateSlug } from "@/lib/utils";
import { desc, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createEventBodySchema = z.object({
  name: z.string().min(3).max(100),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
});

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const parsed = paginationSchema.safeParse({
    limit: searchParams.get("limit") ?? undefined,
    offset: searchParams.get("offset") ?? undefined,
    search: searchParams.get("search") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parâmetros inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { limit, offset, search }: PaginationParams = parsed.data;

  try {
    const rows = await db
      .select({
        event: events,
        totalGuests: sql<number>`count(distinct ${guests.id})`,
        totalCheckins: sql<number>`count(distinct ${checkins.id})`,
      })
      .from(events)
      .leftJoin(guests, eq(guests.eventId, events.id))
      .leftJoin(checkins, eq(checkins.eventId, events.id))
      .groupBy(events.id)
      .orderBy(desc(events.startDate));

    const filtered = search
      ? rows.filter((r) => r.event.name.toLowerCase().includes(search.toLowerCase()))
      : rows;

    const total = filtered.length;
    const paged = filtered.slice(offset, offset + limit).map((r) => ({
      ...r.event,
      totalGuests: Number(r.totalGuests),
      totalCheckins: Number(r.totalCheckins),
    }));

    return NextResponse.json({
      data: paged,
      pagination: { total, limit, offset, hasMore: offset + limit < total },
    });
  } catch (error) {
    console.error("[GET /api/admin/presences/events]", error);
    return NextResponse.json({ error: "Erro ao buscar eventos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const parsed = createEventBodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { name, startDate, endDate } = parsed.data;

  if (new Date(endDate) <= new Date(startDate)) {
    return NextResponse.json(
      { error: "Data de término deve ser após a data de início" },
      { status: 400 },
    );
  }

  try {
    const baseSlug = generateSlug(name);
    let slug = baseSlug;
    let suffix = 1;

    while (true) {
      const [existing] = await db.select({ id: events.id }).from(events).where(eq(events.slug, slug));
      if (!existing) break;
      suffix++;
      slug = `${baseSlug}-${suffix}`;
    }

    const [data] = await db
      .insert(events)
      .values({
        name,
        slug,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      })
      .returning();

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/presences/events]", error);
    return NextResponse.json({ error: "Erro ao criar evento" }, { status: 500 });
  }
}
