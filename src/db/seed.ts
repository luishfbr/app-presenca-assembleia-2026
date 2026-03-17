import { auth } from "@/server/auth";
import { env } from "@/lib/env";
import { db } from "./client";
import { users } from "./schema/auth/users";
import { eq } from "drizzle-orm";

async function seed() {
  const admin = {
    username: env.ADMIN_USERNAME,
    password: env.ADMIN_PASSWORD,
    email: env.ADMIN_EMAIL,
    name: env.ADMIN_FULLNAME,
  };

  const data = await auth.api.signUpEmail({
    body: admin,
  });

  if (!data) {
    console.log("Admin already exists");
    return;
  }

  const changeRole = await db
    .update(users)
    .set({
      role: "admin",
    })
    .where(eq(users.id, data.user.id));

  if (!changeRole) {
    console.log("Failed to change role");
    return;
  }

  console.log("Admin created and role changed");
  return;
}

seed();
