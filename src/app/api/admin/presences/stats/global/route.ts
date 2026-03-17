import { db } from "@/db/client";
import { checkins } from "@/db/schema/presence/checkins";
import { events } from "@/db/schema/presence/events";
import { guests } from "@/db/schema/presence/guests";
import { users } from "@/db/schema/auth/users";
import { decrypt } from "@/lib/crypto";
import { count, desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { RECENT_CHECKINS_LIMIT } from "@/features/stats/types";
import type { GlobalStatsData } from "@/features/stats/types";

export async function GET() {
  try {
    const [
      [{ totalEvents }],
      [{ totalGuests }],
      [{ totalCheckins: totalCheckinsCount }],
      checkinsByEventRaw,
      checkinsByUserRaw,
      recentRaw,
    ] = await Promise.all([
      db.select({ totalEvents: count() }).from(events),
      db.select({ totalGuests: count() }).from(guests),
      db.select({ totalCheckins: count() }).from(checkins),
      db
        .select({
          eventId: events.id,
          eventName: events.name,
          eventSlug: events.slug,
          totalCheckins: sql<number>`count(distinct ${checkins.id})`,
          totalGuests: sql<number>`count(distinct ${guests.id})`,
        })
        .from(events)
        .leftJoin(checkins, eq(checkins.eventId, events.id))
        .leftJoin(guests, eq(guests.eventId, events.id))
        .groupBy(events.id, events.name, events.slug)
        .orderBy(desc(sql`count(distinct ${checkins.id})`)),
      db
        .select({
          userId: checkins.userId,
          userName: users.name,
          count: count(),
        })
        .from(checkins)
        .leftJoin(users, eq(checkins.userId, users.id))
        .groupBy(checkins.userId, users.name)
        .orderBy(desc(count())),
      db
        .select({ checkin: checkins, guest: guests, user: users, event: events })
        .from(checkins)
        .leftJoin(guests, eq(checkins.guestId, guests.id))
        .leftJoin(users, eq(checkins.userId, users.id))
        .leftJoin(events, eq(checkins.eventId, events.id))
        .orderBy(desc(checkins.createdAt))
        .limit(RECENT_CHECKINS_LIMIT),
    ]);

    const attendanceRate =
      totalGuests > 0
        ? Math.round((totalCheckinsCount / totalGuests) * 1000) / 10
        : 0;

    const checkinsByEvent = checkinsByEventRaw.map((r) => {
      const tc = Number(r.totalCheckins);
      const tg = Number(r.totalGuests);
      return {
        eventName: r.eventName,
        eventSlug: r.eventSlug,
        totalCheckins: tc,
        totalGuests: tg,
        attendanceRate: tg > 0 ? Math.round((tc / tg) * 1000) / 10 : 0,
      };
    });

    const recentCheckins = recentRaw.map((r) => ({
      id: r.checkin.id,
      guestName: r.guest ? decrypt(r.guest.name) : "—",
      guestDocument: r.guest ? decrypt(r.guest.document) : "—",
      guestType: r.guest?.type ?? "—",
      userName: r.user?.name ?? null,
      eventName: r.event?.name ?? "—",
      eventSlug: r.event?.slug ?? "",
      createdAt: r.checkin.createdAt.toISOString(),
    }));

    const data: GlobalStatsData = {
      totalEvents,
      totalGuests,
      totalCheckins: totalCheckinsCount,
      attendanceRate,
      checkinsByEvent,
      checkinsByUser: checkinsByUserRaw.map((r) => ({
        userId: r.userId,
        userName: r.userName,
        count: r.count,
      })),
      recentCheckins,
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/admin/presences/stats/global]", error);
    return NextResponse.json({ error: "Erro ao buscar estatísticas globais" }, { status: 500 });
  }
}
