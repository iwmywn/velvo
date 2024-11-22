import type { Metadata } from "next";
import "./globals.css";
import { montserrat } from "./ui/fonts";
import Header from "./ui/header";
import Footer from "./ui/footer";

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
        className={`${montserrat.className} mb-[34rem] pt-20 antialiased min-[422px]:mb-[32rem] min-[483px]:mb-[25rem] sm:mb-[23rem] min-[969px]:mb-[16.5rem]`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
