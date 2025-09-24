import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string | null;
    sub: string | null;
    user: {
      address: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string | null;
    sub?: string | null;
    id?: string | null;
  }
}
