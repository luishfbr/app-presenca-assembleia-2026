import { db } from "@/db/client";
import { checkins } from "@/db/schema/presence/checkins";
import { events } from "@/db/schema/presence/events";
import { guests } from "@/db/schema/presence/guests";
import { users } from "@/db/schema/auth/users";
import { decrypt } from "@/lib/crypto";
import { maskDocument } from "@/lib/utils";
import { asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { ReportRow } from "@/features/reports/types";

const querySchema = z.object({
  eventSlug: z.string().min(1, "eventSlug obrigatório"),
  type: z.enum(["full", "checked", "unchecked"]).default("full"),
});

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    eventSlug: request.nextUrl.searchParams.get("eventSlug") ?? undefined,
    type: request.nextUrl.searchParams.get("type") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parâmetros inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { eventSlug, type } = parsed.data;

  try {
    const [event] = await db
      .select({ id: events.id })
      .from(events)
      .where(eq(events.slug, eventSlug));

    if (!event) {
      return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
    }

    const eventId = event.id;

    const [allGuests, allCheckins] = await Promise.all([
      db.select().from(guests).where(eq(guests.eventId, eventId)),
      db
        .select({
          guestId: checkins.guestId,
          createdAt: checkins.createdAt,
          operatorName: users.name,
        })
        .from(checkins)
        .leftJoin(users, eq(checkins.userId, users.id))
        .where(eq(checkins.eventId, eventId))
        .orderBy(asc(checkins.createdAt)),
    ]);

    // Map: guestId → first checkin (earliest createdAt)
    const checkinMap = new Map<string, { createdAt: Date; operatorName: string | null }>();
    for (const c of allCheckins) {
      if (!checkinMap.has(c.guestId)) {
        checkinMap.set(c.guestId, { createdAt: c.createdAt, operatorName: c.operatorName ?? null });
      }
    }

    const allRows: ReportRow[] = allGuests.map((g) => {
      const checkin = checkinMap.get(g.id);
      const checkedIn = checkin !== undefined;
      return {
        nome: decrypt(g.name),
        documento: maskDocument(decrypt(g.document)),
        tipo: g.type,
        status: checkedIn ? "Presente" : "Ausente",
        dataCheckin: checkin ? checkin.createdAt.toLocaleString("pt-BR") : null,
        operador: checkin?.operatorName ?? null,
      };
    });

    allRows.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

    const data =
      type === "checked"
        ? allRows.filter((r) => r.status === "Presente")
        : type === "unchecked"
          ? allRows.filter((r) => r.status === "Ausente")
          : allRows;

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/admin/presences/reports]", error);
    return NextResponse.json({ error: "Erro ao gerar relatório" }, { status: 500 });
  }
}
