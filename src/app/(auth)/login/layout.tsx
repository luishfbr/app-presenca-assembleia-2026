import { getServerSession } from "@/server/session";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    return <>{children}</>;
  }

  if (session.user.role === "admin") {
    redirect("/dashboard");
  }

  redirect("/checkin");
}
