"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <main className="relative z-10 flex h-screen flex-col items-center gap-2 bg-white pt-52">
          <h2 className="text-lg font-semibold">Something went wrong!</h2>
          <p>{error.message}</p>
          <button
            className="mt-2 rounded-md bg-black px-4 py-2 text-sm text-white transition-all duration-300 hover:scale-95"
            onClick={() => reset()}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
