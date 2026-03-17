import { db } from "@/db/client";
import { siteConfig } from "@/db/schema/presence/site-config";
import { getServerSession } from "@/server/session";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

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
    console.error("[GET /api/presences/config]", error);
    return NextResponse.json(
      { error: "Erro ao buscar configurações" },
      { status: 500 },
    );
  }
}
