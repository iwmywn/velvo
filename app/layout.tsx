import type { Metadata } from "next";
import "./globals.css";
import { montserrat } from "@/app/ui/fonts";
import Header from "@/app/ui/header";
import Footer from "@/app/ui/footer";
import ScrollToTop from "@/app/ui/to-top";
import { FooterHeightProvider } from "@/app/hooks/footer-height";
import Gap from "@/app/ui/gap";

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
          <Gap />
        </FooterHeightProvider>
        <ScrollToTop />
      </body>
    </html>
  );
}
