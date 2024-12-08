import type { Metadata } from "next";
import "@app/globals.css";
import { montserrat } from "@ui/fonts";
import Header from "@ui/header";
import Footer from "@ui/footer";
import ScrollToTop from "@ui/to-top";
import { HeightProvider } from "@ui/hooks/height";
import Gap from "@ui/gap";
import PopUp from "@ui/pop-up";
import Provider from "./provider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: {
    template: "%s - StyleWave",
    default: "StyleWave",
  },
  description: "fashion",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${montserrat.className} antialiased`}>
          {/* <Provider> */}
          {/* <div id="popups" className="relative z-[9999]" /> */}
          <PopUp />
          <HeightProvider>
            <Header />
            <Gap z={10} />
          </HeightProvider>
          {children}
          <HeightProvider>
            <Gap z={-9999} />
            <Footer />
          </HeightProvider>
          <ScrollToTop />
          {/* </Provider> */}
        </body>
      </html>
    </SessionProvider>
  );
}
