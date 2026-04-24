import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  // Extend JWT to hold custom properties before they get put into session
 export interface Session {
    user: {
        role:string;
    } & DefaultSession['user']//let the remaining property be
  }
}