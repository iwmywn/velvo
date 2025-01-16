import EmailForm from "@ui/account/email-form";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "Resend Verification Email" };
}

export default function ResendVerificationEmailPage() {
  return (
    <EmailForm
      title="RESEND VERIFYCATION EMAIL"
      enpoint="/api/resend-verification-email"
      buttonText="RESEND EMAIL"
    />
  );
}
