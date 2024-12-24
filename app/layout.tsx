import type { Metadata } from "next";
import "@app/globals.css";
import { montserrat } from "@ui/fonts";
import Header from "@ui/header";
import Footer from "@ui/footer";
import ScrollToTop from "@ui/to-top";
import { HeightProvider } from "@ui/hooks/height";
import { CartProvider } from "@ui/hooks/cart";
import Gap from "@ui/gap";
import PopUp from "@ui/pop-up";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@ui/hooks/auth";
import { ToastContainer } from "react-toastify";
import { siteConfig } from "@lib/config";

export const metadata: Metadata = {
  title: {
    template: "%s - StyleWave",
    default: siteConfig.maintenanceMode
      ? "Maintenance - StyleWave"
      : "StyleWave",
  },
  description: siteConfig.maintenanceMode
    ? "Website is under maintenance"
    : "fashion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (siteConfig.maintenanceMode) {
    return (
      <html lang="en">
        <body className={`${montserrat.className} antialiased`}>
          <div id="popups" className="relative z-[9999]" />
          <PopUp />
          <div className="flex min-h-screen items-center justify-center">
            <h1 className="text-3xl font-bold">Be right back!</h1>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <div id="popups" className="relative z-[9999]">
              <ToastContainer
                closeButton={false}
                icon={false}
                hideProgressBar
                closeOnClick
                pauseOnFocusLoss
                pauseOnHover
              />
            </div>
            <PopUp />
            <HeightProvider>
              <Header />
              <Gap z={10} />
              {children}
            </HeightProvider>
            <HeightProvider>
              <Gap z={-9999} />
              <Footer />
            </HeightProvider>
            <ScrollToTop />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
