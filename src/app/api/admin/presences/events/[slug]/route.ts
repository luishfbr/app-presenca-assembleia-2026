import { db } from "@/db/client";
import { events } from "@/db/schema/presence/events";
import { generateSlug } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateEventBodySchema = z.object({
  name: z.string().min(3).max(100).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
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

    return NextResponse.json({ data: event });
  } catch (error) {
    console.error("[GET /api/admin/presences/events/[slug]]", error);
    return NextResponse.json({ error: "Erro ao buscar evento" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const parsed = updateEventBodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const update: Record<string, unknown> = {};
  if (parsed.data.name) update.name = parsed.data.name;
  if (parsed.data.startDate) update.startDate = new Date(parsed.data.startDate);
  if (parsed.data.endDate) update.endDate = new Date(parsed.data.endDate);
  update.updatedAt = new Date();

  try {
    const [data] = await db
      .update(events)
      .set(update)
      .where(eq(events.slug, slug))
      .returning();

    if (!data) {
      return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[PATCH /api/admin/presences/events/[slug]]", error);
    return NextResponse.json({ error: "Erro ao atualizar evento" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const [data] = await db.delete(events).where(eq(events.slug, slug)).returning();

    if (!data) {
      return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[DELETE /api/admin/presences/events/[slug]]", error);
    return NextResponse.json({ error: "Erro ao excluir evento" }, { status: 500 });
  }
}
