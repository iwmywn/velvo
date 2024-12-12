import { Metadata } from "next";
import AccountSettings from "@ui/account/settings";

export function generateMetadata(): Metadata {
  return { title: "Account Settings" };
}

export default function AccountPage() {
  return <AccountSettings />;
}
