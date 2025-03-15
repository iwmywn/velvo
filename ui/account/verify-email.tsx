"use client";

import { useState, useEffect } from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";
import Loading from "@ui/loading";
import { handleTokenVerification } from "@lib/utils";
import Title from "@ui/account/title";

export default function VerifyEmail({
  token,
  email,
}: {
  token: string | undefined;
  email: string | undefined;
}) {
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    handleTokenVerification(
      "verify-email",
      setStatus,
      setMessage,
      setLoading,
      token,
      email,
    );
  }, [token, email]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Title
        title={
          status === "success" ? (
            <FaCheck size={30} />
          ) : status === "error" ? (
            <FaXmark size={30} />
          ) : (
            "Unknown"
          )
        }
      />
      {message}
    </>
  );
}
