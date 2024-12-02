"use client";

import Link from "next/link";
import { useEffect } from "react";
import Button from "@ui/button";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative z-10 flex h-screen flex-col items-center gap-2 bg-white px-8 pt-52 text-center md:px-20">
      <h2 className="text-lg font-semibold">Something went wrong!</h2>
      <Link href="/" className="mt-2">
        <Button>Go home</Button>
      </Link>
    </main>
  );
}
