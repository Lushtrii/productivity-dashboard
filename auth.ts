import NextAuth, { type DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import { findOrCreateUser } from "./lib/data";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

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
    authorized: async ({ auth, request }) => {
      const { pathname } = request.nextUrl;

      const isDashboardRoute = pathname.startsWith("/dashboard");
      const isLoggedIn = !!auth;
      const isGuest = request.cookies.get("demo_mode")?.value === "true";

      if (isDashboardRoute && !isLoggedIn && !isGuest) {
        const homeURL = new URL("/", request.url);
        return NextResponse.redirect(homeURL);
      }

      return true;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider && profile?.id) {
        const id = await findOrCreateUser(account.provider, profile.id);
        user.id = id;
      }
      return true;
    },
    jwt({ token, user, profile }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      };
    },
  },
});

export async function startGuestSession() {
  const cookieStore = await cookies();
  cookieStore.set("demo_mode", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  redirect("/dashboard");
}
