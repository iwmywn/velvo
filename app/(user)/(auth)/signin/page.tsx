import AuthOverview from "@ui/account/auth-overview";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "Sign in" };
}

export default function AccountPage() {
  return <AuthOverview />;
}
