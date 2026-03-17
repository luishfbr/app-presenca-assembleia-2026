import { db } from "@/db/client";
import { eventUsers } from "@/db/schema/presence/event-users";
import { users } from "@/db/schema/auth/users";
import { events } from "@/db/schema/presence/events";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const addUserBodySchema = z.object({
  userId: z.string().min(1, "userId obrigatório"),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    if (!event) {
      return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
    }

    const rows = await db
      .select({ eventUser: eventUsers, user: users })
      .from(eventUsers)
      .leftJoin(users, eq(eventUsers.userId, users.id))
      .where(eq(eventUsers.eventId, event.id));

    const data = rows.map((r) => ({
      ...r.eventUser,
      user: r.user,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/admin/presences/events/[slug]/users]", error);
    return NextResponse.json({ error: "Erro ao buscar usuários do evento" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const parsed = addUserBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    if (!event) {
      return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
    }

    const [data] = await db
      .insert(eventUsers)
      .values({ eventId: event.id, userId: parsed.data.userId })
      .returning();

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/admin/presences/events/[slug]/users]", error);
    if (error?.code === "23505") {
      return NextResponse.json(
        { error: "Usuário já está no evento" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Erro ao adicionar usuário ao evento" }, { status: 500 });
  }
}
