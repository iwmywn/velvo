import EmailForm from "@/app/ui/account/email-form";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "Resend Verification Email" };
}

export default function ResendVerificationEmailPage() {
  return (
    <EmailForm
      title="RESEND VERIFYCATION EMAIL"
      fetchUrl="/api/auth/resend-verification-email"
      buttonText="RESEND EMAIL"
    />
  );
}
