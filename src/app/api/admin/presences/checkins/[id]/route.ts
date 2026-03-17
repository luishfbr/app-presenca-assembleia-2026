import { db } from "@/db/client";
import { checkins } from "@/db/schema/presence/checkins";
import { decrypt } from "@/lib/crypto";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import type { Guest } from "@/db/schema/presence/guests";

type RouteParams = { params: Promise<{ id: string }> };

function decryptGuest(guest: Guest | null | undefined): Guest | null {
  if (!guest) return null;
  return {
    ...guest,
    name: decrypt(guest.name),
    document: decrypt(guest.document),
  };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const data = await db.query.checkins.findFirst({
      where: eq(checkins.id, id),
      with: { guest: true, user: true },
    });

    if (!data) {
      return NextResponse.json(
        { error: "Checkin não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        data: {
          ...data,
          guest: decryptGuest(data.guest),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[GET /api/admin/presences/checkins/[id]]", error);

    return NextResponse.json(
      { error: "Erro ao buscar checkin" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const [data] = await db
      .delete(checkins)
      .where(eq(checkins.id, id))
      .returning();

    if (!data) {
      return NextResponse.json(
        { error: "Checkin não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/admin/presences/checkins/[id]]", error);

    return NextResponse.json(
      { error: "Erro ao deletar checkin" },
      { status: 500 },
    );
  }
}
