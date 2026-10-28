import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const GUEST_COOKIE = "kotlin_up_guest";

export async function getCurrentUser() {
  // Guest identities are deliberately development-only. Production must use OAuth/session auth.
  if (process.env.NODE_ENV === "production") return null;

  const cookieStore = await cookies();
  const existingId = cookieStore.get(GUEST_COOKIE)?.value;
  if (existingId) {
    const existing = await prisma.user.findUnique({ where: { id: existingId } });
    if (existing) return existing;
  }

  const identity = randomUUID();
  const user = await prisma.user.create({
    data: {
      githubId: `local-${identity}`,
      email: `guest-${identity}@local.invalid`,
      name: "Usuario local",
    },
  });
  cookieStore.set(GUEST_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return user;
}
