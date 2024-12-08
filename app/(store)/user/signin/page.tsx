import AccountOverview from "@ui/account/overview";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "Sign in to your account" };
}

export default function AccountPage() {
  return <AccountOverview />;
}
