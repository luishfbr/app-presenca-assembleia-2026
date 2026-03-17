import { db } from "@/db/client";
import { events } from "@/db/schema/presence/events";
import { eventUsers } from "@/db/schema/presence/event-users";
import { getServerSession } from "@/server/session";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function CheckinEventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = await params;
  const session = await getServerSession();

  const [event] = await db.select({ id: events.id }).from(events).where(eq(events.slug, eventSlug));
  if (!event) redirect("/checkin");

  // Sessão e role já verificadas pelo layout pai (checkin/layout.tsx)
  // Aqui apenas validamos se o usuário tem acesso ao evento específico
  const access = await db.query.eventUsers.findFirst({
    where: and(
      eq(eventUsers.eventId, event.id),
      eq(eventUsers.userId, session!.user.id),
    ),
  });

  if (!access) redirect("/checkin");

  return <>{children}</>;
}
