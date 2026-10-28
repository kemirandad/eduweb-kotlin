import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      authorization: { params: { scope: "read:user user:email" } },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "github" || !account.providerAccountId) return false;

      const githubId = account.providerAccountId;
      const email = user.email ?? `github-${githubId}@users.noreply.github.com`;
      await prisma.user.upsert({
        where: { githubId },
        update: { email, name: user.name, avatar: user.image },
        create: { githubId, email, name: user.name, avatar: user.image },
      });
      return true;
    },
    async jwt({ token, account }) {
      if (account?.provider === "github" && account.providerAccountId) {
        const user = await prisma.user.findUnique({
          where: { githubId: account.providerAccountId },
          select: { id: true },
        });
        if (user) token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.userId === "string") {
        session.user.id = token.userId;
      }
      return session;
    },
  },
});
