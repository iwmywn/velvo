import EmailForm from "@ui/account/email-form";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "Forgotten Password" };
}

export default function ForgottenPasswordPage() {
  return (
    <EmailForm
      title="FORGOTTEN PASSWORD"
      enpoint="/api/forgotten-password"
      buttonText="RESET YOUR PASSWORD"
    />
  );
}
