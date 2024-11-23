import type { Metadata } from "next";
import "./globals.css";
import { montserrat } from "./ui/fonts";
import Header from "./ui/header";
import Footer from "./ui/footer";
import ScrollToTop from "./ui/to-top";
import { FooterHeightProvider } from "./hooks/footer-height";

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
        className={`${montserrat.className} pt-[52px] antialiased md:pt-20`}
      >
        <Header />
        <FooterHeightProvider>
          {children}
          <Footer />
        </FooterHeightProvider>
        <ScrollToTop />
      </body>
    </html>
  );
}
