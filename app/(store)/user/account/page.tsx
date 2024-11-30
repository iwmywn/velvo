import AccountOverview from "@/ui/account/overview";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "Account" };
}

export default function AccountPage() {
  return <AccountOverview />;
}
