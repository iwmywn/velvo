"use client";

import Link from "next/link";
import { useEffect } from "react";

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
    <main className="relative z-10 flex h-screen flex-col items-center gap-2 bg-white pt-52">
      <h2 className="text-lg font-semibold">Something went wrong!</h2>
      <Link
        href="/"
        className="mt-2 rounded-md bg-black px-4 py-2 text-sm text-white transition-all duration-300 hover:scale-95"
      >
        Go home
      </Link>
    </main>
  );
}
