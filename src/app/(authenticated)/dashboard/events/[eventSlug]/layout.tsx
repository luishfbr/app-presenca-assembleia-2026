import { db } from "@/db/client";
import { events } from "@/db/schema/presence/events";
import { EventTabs } from "@/features/events/components/event-tabs";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = await params;

  const [event] = await db.select().from(events).where(eq(events.slug, eventSlug));

  if (!event) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <header className="flex flex-col gap-1">
        <Link
          href="/dashboard/events"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para eventos
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{event.name}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(event.startDate).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}{" "}
            até{" "}
            {new Date(event.endDate).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </header>

      <EventTabs eventSlug={eventSlug} />

      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}
