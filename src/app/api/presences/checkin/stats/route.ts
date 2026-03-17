import { db } from "@/db/client";
import { checkins } from "@/db/schema/presence/checkins";
import { events } from "@/db/schema/presence/events";
import { getServerSession } from "@/server/session";
import { and, count, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const querySchema = z.object({
  eventSlug: z.string().min(1, "eventSlug obrigatório"),
});

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const parsed = querySchema.safeParse({
    eventSlug: request.nextUrl.searchParams.get("eventSlug") ?? "",
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

    const [[{ totalCheckins }], [{ myCheckins }]] = await Promise.all([
      db
        .select({ totalCheckins: count() })
        .from(checkins)
        .where(eq(checkins.eventId, eventId)),
      db
        .select({ myCheckins: count() })
        .from(checkins)
        .where(and(eq(checkins.eventId, eventId), eq(checkins.userId, session.user.id))),
    ]);

    return NextResponse.json({ data: { totalCheckins, myCheckins } });
  } catch (error) {
    console.error("[GET /api/presences/checkin/stats]", error);
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 });
  }
}
