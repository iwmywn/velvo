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
      <head>
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
      </head>
      <body className={`${montserrat.className} antialiased`}>
        <nav className="fixed left-0 right-0 top-0 flex items-center justify-between px-16 pt-8 backdrop-blur-sm">
          <Left />
          <Logo />
          <Right />
        </nav>
        {children}
      </body>
    </html>
  );
}
