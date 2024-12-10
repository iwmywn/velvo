import AuthOverview from "@/app/ui/account/auth-overview";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "Sign in to your account" };
}

export default function AccountPage() {
  return <AuthOverview />;
}
