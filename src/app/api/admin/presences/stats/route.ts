import { db } from "@/db/client";
import { checkins } from "@/db/schema/presence/checkins";
import { events } from "@/db/schema/presence/events";
import { guests } from "@/db/schema/presence/guests";
import { users } from "@/db/schema/auth/users";
import { decrypt } from "@/lib/crypto";
import { count, desc, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { RECENT_CHECKINS_LIMIT } from "@/features/stats/types";
import type { StatsData } from "@/features/stats/types";
import { z } from "zod";

const querySchema = z.object({
  eventSlug: z.string().min(1, "eventSlug obrigatório"),
});

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    eventSlug: request.nextUrl.searchParams.get("eventSlug") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parâmetros inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { eventSlug } = parsed.data;

  try {
    const [event] = await db.select({ id: events.id }).from(events).where(eq(events.slug, eventSlug));
    if (!event) {
      return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
    }

    const eventId = event.id;
    const [
      [{ totalCheckins }],
      [{ totalGuests }],
      checkinsByUserRaw,
      checkinsByHourRaw,
      recentRaw,
    ] = await Promise.all([
      db.select({ totalCheckins: count() }).from(checkins).where(eq(checkins.eventId, eventId)),
      db.select({ totalGuests: count() }).from(guests).where(eq(guests.eventId, eventId)),
      db
        .select({
          userId: checkins.userId,
          userName: users.name,
          count: count(),
        })
        .from(checkins)
        .leftJoin(users, eq(checkins.userId, users.id))
        .where(eq(checkins.eventId, eventId))
        .groupBy(checkins.userId, users.name)
        .orderBy(desc(count())),
      db
        .select({
          hour: sql<number>`EXTRACT(HOUR FROM ${checkins.createdAt})::int`,
          count: count(),
        })
        .from(checkins)
        .where(eq(checkins.eventId, eventId))
        .groupBy(sql`EXTRACT(HOUR FROM ${checkins.createdAt})::int`)
        .orderBy(sql`EXTRACT(HOUR FROM ${checkins.createdAt})::int`),
      db
        .select({ checkin: checkins, guest: guests, user: users })
        .from(checkins)
        .leftJoin(guests, eq(checkins.guestId, guests.id))
        .leftJoin(users, eq(checkins.userId, users.id))
        .where(eq(checkins.eventId, eventId))
        .orderBy(desc(checkins.createdAt))
        .limit(RECENT_CHECKINS_LIMIT),
    ]);

    // Preenche todos os 24 slots de hora (sem lacunas para o Recharts)
    const hourMap = new Map(checkinsByHourRaw.map((r) => [r.hour, r.count]));
    const checkinsByHour = Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      label: String(h).padStart(2, "0") + "h",
      count: hourMap.get(h) ?? 0,
    }));

    const attendanceRate =
      totalGuests > 0
        ? Math.round((totalCheckins / totalGuests) * 1000) / 10
        : 0;

    const recentCheckins = recentRaw.map((r) => ({
      id: r.checkin.id,
      guestName: r.guest ? decrypt(r.guest.name) : "—",
      guestDocument: r.guest ? decrypt(r.guest.document) : "—",
      guestType: r.guest?.type ?? "—",
      userName: r.user?.name ?? null,
      createdAt: r.checkin.createdAt.toISOString(),
    }));

    const data: StatsData = {
      totalCheckins,
      totalGuests,
      attendanceRate,
      checkinsByUser: checkinsByUserRaw.map((r) => ({
        userId: r.userId,
        userName: r.userName,
        count: r.count,
      })),
      checkinsByHour,
      recentCheckins,
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/admin/presences/stats]", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 },
    );
  }
}
