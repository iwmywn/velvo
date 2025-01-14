import { Metadata } from "next";
import AccountSettings from "@ui/account/settings";

export function generateMetadata(): Metadata {
  return { title: "Account" };
}

export default function AccountPage() {
  return <AccountSettings />;
}
