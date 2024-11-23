import type { Metadata } from "next";
import "./globals.css";
import { montserrat } from "./ui/fonts";
import Header from "./ui/header";
import Footer from "./ui/footer";
import ScrollToTop from "./ui/to-top";

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
        className={`${montserrat.className} mb-[34rem] pt-[52px] antialiased min-[422px]:mb-[32rem] min-[483px]:mb-[25rem] sm:mb-[23rem] md:pt-20 min-[969px]:mb-[16.5rem]`}
      >
        <Header />
        {children}
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
