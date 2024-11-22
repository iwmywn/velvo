import type { Metadata } from "next";
import "./globals.css";
import { montserrat } from "./ui/fonts";
import Left from "./ui/header/left";
import Logo from "./ui/header/logo";
import Right from "./ui/header/right";

export const metadata: Metadata = {
  title: "StyleWave",
  description: "fashion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} flex flex-col items-center px-16 pt-20 antialiased`}
      >
        <div className="fixed left-0 right-0 top-0 z-10 flex justify-center px-16">
          <nav className="flex w-full max-w-[90rem] items-center justify-between bg-white/80 pb-3 pt-8 backdrop-blur">
            <Left />
            <Logo />
            <Right />
          </nav>
        </div>
        {children}
      </body>
    </html>
  );
}
