import { db } from "@/db/client";
import { siteConfig } from "@/db/schema/presence/site-config";
import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const field = formData.get("field") as string | null;

    if (!file || !field) {
      return NextResponse.json(
        { error: "Arquivo e campo são obrigatórios" },
        { status: 400 },
      );
    }

    if (field !== "background" && field !== "loading") {
      return NextResponse.json({ error: "Campo inválido" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF." },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Tamanho máximo: 5 MB." },
        { status: 400 },
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
    const filename = `${crypto.randomUUID()}.${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "images", "uploads");

    await mkdir(uploadsDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    await writeFile(path.join(uploadsDir, filename), Buffer.from(bytes));

    const url = `/images/uploads/${filename}`;
    const dbField =
      field === "background" ? "backgroundImageUrl" : "loadingImageUrl";

    const now = new Date();
    await db
      .insert(siteConfig)
      .values({ id: "default", [dbField]: url, createdAt: now, updatedAt: now })
      .onConflictDoUpdate({
        target: siteConfig.id,
        set: { [dbField]: url, updatedAt: new Date() },
      });

    return NextResponse.json({ data: { url } });
  } catch (error) {
    console.error("[POST /api/admin/presences/config/upload]", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload da imagem" },
      { status: 500 },
    );
  }
}
