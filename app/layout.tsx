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
        className={`${montserrat.className} mb-[35rem] pt-20 antialiased xl:mb-[17rem]`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
