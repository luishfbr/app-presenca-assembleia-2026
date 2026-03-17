import { db } from "@/db/client";
import { siteConfig } from "@/db/schema/presence/site-config";
import { updateConfigSchema } from "@/features/config/validations";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    let config = await db.query.siteConfig.findFirst({
      where: eq(siteConfig.id, "default"),
    });

    if (!config) {
      [config] = await db
        .insert(siteConfig)
        .values({ id: "default" })
        .returning();
    }

    return NextResponse.json({ data: config });
  } catch (error) {
    console.error("[GET /api/admin/presences/config]", error);
    return NextResponse.json(
      { error: "Erro ao buscar configurações" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updateConfigSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Parâmetros inválidos",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const [updated] = await db
      .insert(siteConfig)
      .values({ id: "default", ...parsed.data })
      .onConflictDoUpdate({
        target: siteConfig.id,
        set: { ...parsed.data, updatedAt: new Date() },
      })
      .returning();

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PATCH /api/admin/presences/config]", error);
    return NextResponse.json(
      { error: "Erro ao salvar configurações" },
      { status: 500 },
    );
  }
}
