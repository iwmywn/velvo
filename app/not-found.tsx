import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative z-10 flex h-screen flex-col items-center justify-center gap-2 bg-white">
      <h2 className="text-xl font-semibold">NOT FOUND</h2>
      <p>This page does not exist.</p>
      <Link
        href="/"
        className="mt-2 rounded-md bg-black px-4 py-2 text-sm text-white transition-all duration-300 hover:scale-95"
      >
        Go home
      </Link>
    </main>
  );
}
