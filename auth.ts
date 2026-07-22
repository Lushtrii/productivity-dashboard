import NextAuth, { type DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import { findOrCreateUser } from "./lib/data";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider && profile?.id) {
        const id = await findOrCreateUser(account.provider, profile.id);
        user.id = id;
      }
      return true;
    },
    jwt({ token, user, profile }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token, user }) {
      session.user.id = token.id;
      return session;
    },
  },
});
