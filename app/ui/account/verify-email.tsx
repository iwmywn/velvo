"use client";

import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import Loading from "@ui/loading";
import Wrapper from "@ui/account/wrapper";
import { handleTokenVerification } from "@lib/utils";

export default function VerifyEmail({ token }: { token: string | undefined }) {
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
    );
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="mt-44">
      <Wrapper
        title={
          status === "success" ? (
            <FaCheck size={30} />
          ) : status === "error" ? (
            <FaXmark size={30} />
          ) : (
            "Unknown"
          )
        }
      >
        {message}
      </Wrapper>
    </main>
  );
}
