"use client";

import links from "../data/nav-links";
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
import { Fragment, useEffect, useRef } from "react";
import { useFooterHeight } from "../hooks/footer-height";
import Link from "next/link";

const sections = [
  {
    title: "May We Help You?",
    links: [
      {
        name: "Contact us",
        href: "mailto:tuanha321@uef.edu.vn",
      },
    ],
  },
  {
    title: "Categories",
    links: links,
  },
  {
    title: "The company",
    links: [
      {
        name: "Privacy",
        href: "#",
      },
      {
        name: "Term & conditions",
        href: "#",
      },
    ],
  },
] as const;

const socials = [
  {
    icon: FaFacebook,
    href: "#",
  },
  {
    icon: FaInstagram,
    href: "#",
  },
  {
    icon: FaYoutube,
    href: "#",
  },
  {
    icon: FaLinkedin,
    href: "#",
  },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const { setFooterHeight } = useFooterHeight();

  useEffect(() => {
    const updateFooterHeight = () => {
      if (footerRef.current) {
        setFooterHeight(footerRef.current.offsetHeight);
      }
    };

    updateFooterHeight();

    window.addEventListener("resize", updateFooterHeight);
    return () => window.removeEventListener("resize", updateFooterHeight);
  }, [setFooterHeight]);

  return (
    <footer
      ref={footerRef}
      className="fixed bottom-0 left-0 right-0 z-[9] flex flex-col items-center gap-10 bg-stone-100 px-8 pb-4 pt-10 md:px-20"
    >
      <div className="flex w-full flex-wrap justify-between gap-8">
        {sections.map(({ title, links }, index) => (
          <div
            className="flex flex-col flex-wrap items-center gap-x-8 gap-y-2"
            key={index}
          >
            <span className="font-medium">{title}</span>
            {links.map(({ name, href }, index) => (
              <Fragment key={index}>
                {index > 0 && (
                  <Link
                    className="text-sm text-black/80 hover:underline"
                    href={href}
                  >
                    {name}
                  </Link>
                )}
              </Fragment>
            ))}
          </div>
        ))}
        <div className="">
          <span className="font-medium">Sign up for our newsletter</span>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              className="my-2 mr-4 h-9 w-60 rounded-md border border-black/20 px-4 py-2 text-sm text-black/80"
              type="email"
              placeholder="Email"
            />
            <button
              className="h-9 rounded-md bg-black px-5 py-1 text-sm text-white transition-all duration-500 hover:scale-95"
              type="submit"
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-y-4 sm:flex-row sm:justify-between">
        <span className="text-xs text-black/65">© 2024 hat - nnva.</span>
        <span className="flex gap-7">
          {socials.map(({ icon: Icon, href }, index) => (
            <Link
              className="transition-all duration-500 hover:scale-125"
              href={href}
              rel="noopener"
              key={index}
            >
              <Icon fontSize={20} />
            </Link>
          ))}
        </span>
      </div>
    </footer>
  );
}
