import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export const handler = NextAuth(authConfig);

export const GET = handler;
export const POST = handler;
