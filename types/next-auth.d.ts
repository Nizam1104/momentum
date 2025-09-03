import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string | null;
    user: {
      address: string;
    } & DefaultSession["user"];
  }
}
