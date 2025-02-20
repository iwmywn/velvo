import Link from "next/link";
import Button from "@ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NOT FOUND",
};

export default function NotFound() {
  return (
    <div className="relative z-10 flex h-screen flex-col items-center gap-2 bg-white px-6 pt-52 text-center md:px-16">
      <h2 className="text-lg font-semibold">
        THE PAGE YOU ARE LOOKING FOR COULD NOT BE FOUND
      </h2>
      <p>This page does not exist.</p>
      <Link href="/" className="mt-2">
        <Button>Go home</Button>
      </Link>
    </div>
  );
}
