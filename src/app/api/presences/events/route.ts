import { db } from "@/db/client";
import { eventUsers } from "@/db/schema/presence/event-users";
import { events } from "@/db/schema/presence/events";
import { getServerSession } from "@/server/session";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const rows = await db
      .select({ event: events })
      .from(eventUsers)
      .leftJoin(events, eq(eventUsers.eventId, events.id))
      .where(eq(eventUsers.userId, session.user.id));

    const data = rows
      .filter((r) => r.event !== null)
      .map((r) => r.event!);

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/presences/events]", error);
    return NextResponse.json({ error: "Erro ao buscar eventos" }, { status: 500 });
  }
}
