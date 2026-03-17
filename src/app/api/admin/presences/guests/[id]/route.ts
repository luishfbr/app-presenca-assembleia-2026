import { db } from "@/db/client";
import { guests, updateGuestSchema } from "@/db/schema/presence/guests";
import { decrypt, encrypt, hashForSearch } from "@/lib/crypto";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import type { Guest } from "@/db/schema/presence/guests";

type RouteParams = { params: Promise<{ id: string }> };

function decryptGuest(guest: Guest): Guest {
  return {
    ...guest,
    name: decrypt(guest.name),
    document: decrypt(guest.document),
  };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const data = await db.query.guests.findFirst({
      where: eq(guests.id, id),
    });

    if (!data) {
      return NextResponse.json(
        { error: "Convidado não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: decryptGuest(data) }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/admin/presences/guests/[id]]", error);

    return NextResponse.json(
      { error: "Erro ao buscar convidado" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const parsed = updateGuestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Dados inválidos",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  // Criptografa apenas os campos presentes no body
  const updatePayload: Partial<typeof parsed.data> & { updatedAt: Date } = {
    updatedAt: new Date(),
  };

  if (parsed.data.name !== undefined) {
    updatePayload.name = encrypt(parsed.data.name);
  }
  if (parsed.data.document !== undefined) {
    updatePayload.document = encrypt(parsed.data.document);
    updatePayload.documentHash = hashForSearch(parsed.data.document);
  }
  if (parsed.data.type !== undefined) {
    updatePayload.type = parsed.data.type;
  }

  try {
    const [data] = await db
      .update(guests)
      .set(updatePayload)
      .where(eq(guests.id, id))
      .returning();

    if (!data) {
      return NextResponse.json(
        { error: "Convidado não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: decryptGuest(data) }, { status: 200 });
  } catch (error: any) {
    console.error("[PATCH /api/admin/presences/guests/[id]]", error);

    if (error?.code === "23505") {
      return NextResponse.json(
        { error: "Documento já cadastrado" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Erro ao atualizar convidado" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const [data] = await db.delete(guests).where(eq(guests.id, id)).returning();

    if (!data) {
      return NextResponse.json(
        { error: "Convidado não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: decryptGuest(data) }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/admin/presences/guests/[id]]", error);

    return NextResponse.json(
      { error: "Erro ao deletar convidado" },
      { status: 500 },
    );
  }
}
