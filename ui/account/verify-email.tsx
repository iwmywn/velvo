"use client";

import { useState, useEffect } from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";
import Loading from "@ui/loading";
import Title from "@ui/account/title";
import { IconType } from "react-icons/lib";

export default function VerifyEmail({
  token,
  email,
}: {
  token: string | undefined;
  email: string | undefined;
}) {
  const [Icon, setIcon] = useState<IconType>(() => FaXmark);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchToken = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/verify-email?email=${email}&token=${token}`,
        );
        const message = await res.json();

        if (res.ok) setIcon(() => FaCheck);
        setMessage(message);
      } catch (error) {
        console.error("Verification Token Error: ", error);
        setMessage("Something went wrong! Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [token, email]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Title title={<Icon size={30} />} />
      {message}
    </>
  );
}
