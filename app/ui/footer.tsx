"use client";

import { useRef, useState } from "react";
import { useElementHeight } from "@ui/hooks/height";
import Link from "next/link";
import { socialLinks, footerSections } from "@ui/data/constants";
import Button from "@ui/button";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [email, setEmail] = useState<string>("");

  useElementHeight(ref);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // temporarily
    setEmail("");
  };

  return (
    <footer
      ref={ref}
      id="footer"
      className="space-right fixed bottom-0 left-0 right-0 z-[9] flex flex-col items-center gap-10 border-t px-8 pb-4 pt-10 md:px-20"
    >
      <div className="flex w-full flex-wrap justify-between gap-8 text-sm">
        {footerSections.map(({ title, links }, index) => (
          <div
            className="flex flex-col flex-wrap items-center gap-x-8 gap-y-2"
            key={index}
          >
            <span className="font-medium">{title}</span>
            {links.map(({ label, href }) => (
              <Link
                className="text-black/80 hover:underline"
                href={href}
                key={href}
              >
                {label}
              </Link>
            ))}
          </div>
        ))}
        <div>
          <span className="font-medium">Sign up for our newsletter</span>
          <form onSubmit={handleSubmit}>
            <input
              className="my-2 mr-4 h-9 w-60 rounded border border-black/20 px-4 py-2 text-sm text-black/80 outline-none focus:border-black"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit">Sign up</Button>
          </form>
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-y-4 sm:flex-row sm:justify-between">
        <span className="text-xs text-black/65">© 2024 hat - nnva.</span>
        <span className="flex gap-7">
          {socialLinks.map(({ icon: Icon, href }) => (
            <Link
              className="transition-all duration-500 hover:scale-125"
              href={href}
              rel="noopener"
              key={href}
              aria-label="social"
            >
              <Icon fontSize={20} />
            </Link>
          ))}
        </span>
      </div>
    </footer>
  );
}
