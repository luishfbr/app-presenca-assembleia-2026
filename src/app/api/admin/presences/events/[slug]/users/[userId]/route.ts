import { db } from "@/db/client";
import { eventUsers } from "@/db/schema/presence/event-users";
import { events } from "@/db/schema/presence/events";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string; userId: string }> },
) {
  const { slug, userId } = await params;

  try {
    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    if (!event) {
      return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
    }

    const [data] = await db
      .delete(eventUsers)
      .where(and(eq(eventUsers.eventId, event.id), eq(eventUsers.userId, userId)))
      .returning();

    if (!data) {
      return NextResponse.json(
        { error: "Usuário não encontrado no evento" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[DELETE /api/admin/presences/events/[slug]/users/[userId]]", error);
    return NextResponse.json(
      { error: "Erro ao remover usuário do evento" },
      { status: 500 },
    );
  }
}
