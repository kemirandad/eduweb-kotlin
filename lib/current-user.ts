import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const GUEST_COOKIE = "kotlin_up_guest";

export async function getCurrentUser() {
  if (process.env.NODE_ENV === "production") {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return null;
    return prisma.user.findUnique({ where: { id: userId } });
  }

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
