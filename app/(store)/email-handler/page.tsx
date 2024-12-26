import type { Metadata } from "next";
import ResetPassword from "@ui/account/reset-password";
import VerifyEmail from "@ui/account/verify-email";
import NotFound from "@/app/not-found";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const mode = typeof params.mode === "string" ? params.mode : undefined;
  let title: string | undefined;

  if (mode === "verifyEmail") title = "Verify Email";
  else if (mode === "resetPassword") title = "Reset Your Password";
  else title = undefined;

  return {
    title: title || "NOT FOUND",
  };
}

export default async function EmailHandlerPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const mode = typeof params.mode === "string" ? params.mode : undefined;
  const token = typeof params.token === "string" ? params.token : undefined;

  if (mode === "verifyEmail") return <VerifyEmail token={token} />;
  else if (mode === "resetPassword") return <ResetPassword token={token} />;
  else return <NotFound />;
}
