import { db } from "@/db/client";
import { siteConfig } from "@/db/schema/presence/site-config";
import { resolveConfig } from "@/features/config/defaults";
import { KioskCheckin } from "@/features/checkins/components/kiosk-checkin";
import { eq } from "drizzle-orm";

export default async function CheckinEventPage({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = await params;

  const configRow = await db.query.siteConfig.findFirst({
    where: eq(siteConfig.id, "default"),
  });
  const config = resolveConfig(configRow ?? null);

  return <KioskCheckin eventSlug={eventSlug} config={config} />;
}
