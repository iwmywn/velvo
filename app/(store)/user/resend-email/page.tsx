import ResendEmail from "@/app/ui/account/resend-email";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "Resend Email" };
}

export default function ResendEmailPage() {
  return <ResendEmail />;
}
