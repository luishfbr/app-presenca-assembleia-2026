import { db } from "@/db/client";
import { siteConfig } from "@/db/schema/presence/site-config";
import { resolveConfig } from "@/features/config/defaults";
import { getServerSession } from "@/server/session";
import { eq } from "drizzle-orm";
import Image from "next/image";
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

  const hasCustomImage =
    config.backgroundImageUrl !== "/images/checkin-bg.png";
  const useColorBackground =
    !hasCustomImage && config.backgroundColorHex != null;

  return (
    <div className="relative h-dvh overflow-hidden">
      {/* Fundo: cor sólida ou imagem */}
      <div
        className="absolute inset-0 -z-10"
        style={useColorBackground ? { backgroundColor: config.backgroundColorHex! } : undefined}
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
