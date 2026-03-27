import { db } from "@/db/client";
import { siteConfig } from "@/db/schema/presence/site-config";
import { resolveConfig } from "@/features/config/defaults";
import { getServerSession } from "@/server/session";
import { eq } from "drizzle-orm";
import { existsSync } from "fs";
import Image from "next/image";
import path from "path";
import { redirect } from "next/navigation";

export default async function CheckinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) redirect("/login");
  if (session.user.role === "admin") redirect("/dashboard");

  const configRow = await db.query.siteConfig.findFirst({
    where: eq(siteConfig.id, "default"),
  });
  const config = resolveConfig(configRow ?? null);

  const DEFAULT_BG = "/images/checkin-bg.png";
  const DEFAULT_COLOR = "#7DB61C";

  const isDefaultImage = config.backgroundImageUrl === DEFAULT_BG;
  const defaultImageExists =
    !isDefaultImage ||
    existsSync(path.join(process.cwd(), "public", "images", "checkin-bg.png"));

  const hasCustomImage = !isDefaultImage;
  const useColorBackground =
    (!defaultImageExists && isDefaultImage && config.backgroundColorHex == null)
      ? true
      : !hasCustomImage && config.backgroundColorHex != null;

  const backgroundColor =
    !defaultImageExists && isDefaultImage && config.backgroundColorHex == null
      ? DEFAULT_COLOR
      : config.backgroundColorHex ?? DEFAULT_COLOR;

  return (
    <div className="relative h-dvh overflow-hidden">
      {/* Fundo: cor sólida ou imagem */}
      <div
        className="absolute inset-0 -z-10"
        style={useColorBackground ? { backgroundColor } : undefined}
      >
        {!useColorBackground && (
          <Image
            src={config.backgroundImageUrl}
            fill
            alt="Background"
            className="object-fill"
            priority
            unoptimized={hasCustomImage}
          />
        )}
      </div>

      {/* Overlay escuro */}
      <div className="absolute inset-0 -z-10 bg-black/10" />

      {children}
    </div>
  );
}
