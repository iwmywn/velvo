import type { Metadata } from "next";
import "@app/globals.css";
import { montserrat } from "@ui/fonts";
import Header from "@ui/header";
import Footer from "@ui/footer";
import ScrollToTop from "@ui/to-top";
import { HeightProvider } from "@ui/hooks/height";
import Gap from "@ui/gap";
import PopUp from "@ui/pop-up";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@ui/hooks/auth";
import { ToastContainer } from "react-toastify";

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
        <AuthProvider>
          <div id="popups" className="relative z-[9999]">
            <ToastContainer
              closeButton={false}
              icon={false}
              hideProgressBar
              closeOnClick
              pauseOnFocusLoss
            />
          </div>
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
        </AuthProvider>
      </body>
    </html>
  );
}
