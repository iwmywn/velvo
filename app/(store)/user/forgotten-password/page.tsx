import ForgottenPassword from "@/app/ui/account/forgotten-password";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "Forgotten Password" };
}

export default function ForgottenPasswordPage() {
  return <ForgottenPassword />;
}
