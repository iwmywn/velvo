import type { Metadata } from "next";
import "./globals.css";
import { montserrat } from "@/ui/fonts";
import Header from "@/ui/header";
import Footer from "@/ui/footer";
import ScrollToTop from "@/ui/to-top";
import { HeightProvider } from "@/hooks/useHeight";
import Gap from "@/ui/gap";

export const metadata: Metadata = {
  title: {
    template: "%s - StyleWave",
    default: "StyleWave",
  },
  description: "fashion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <HeightProvider>
          <Header />
          <Gap />
        </HeightProvider>
        {children}
        <HeightProvider>
          <Gap />
          <Footer />
        </HeightProvider>
        <ScrollToTop />
      </body>
    </html>
  );
}
