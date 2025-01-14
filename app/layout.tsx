import type { Metadata } from "next";
import "@/app/globals.css";
import { montserrat } from "@ui/fonts";
import Header from "@ui/header";
import Footer from "@ui/footer";
import ScrollToTop from "@ui/to-top";
import Gap from "@ui/gap";
import PopUp from "@ui/pop-up";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Slide } from "react-toastify";
import { siteConfig } from "@lib/config";
import { getProducts } from "@lib/data";
import {
  AuthProvider,
  HeightProvider,
  ProductProvider,
  UIStateProvider,
} from "@ui/contexts";
import { verifySession } from "@lib/dal";

export const metadata: Metadata = {
  title: {
    template: "%s | Velvo",
    default: siteConfig.maintenanceMode ? "Maintenance | Velvo" : "Velvo",
  },
  description: siteConfig.maintenanceMode
    ? "Website is under maintenance"
    : "Velvo is your ultimate online fashion destination, offering a wide range of high-quality clothing that caters to every style. From trendy streetwear to elegant pieces, we bring you the latest fashion trends to keep your wardrobe fresh and stylish.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (siteConfig.maintenanceMode) {
    return (
      <html lang="en">
        <body className={`${montserrat.className} antialiased`}>
          <UIStateProvider>
            <div id="popups" className="relative z-[9999]" />
            <PopUp />
            <main className="flex min-h-screen items-center justify-center text-3xl font-bold">
              Be right back!
            </main>
          </UIStateProvider>
        </body>
      </html>
    );
  }

  const [products, { userId, image }] = await Promise.all([
    getProducts(),
    verifySession(),
  ]);

  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <UIStateProvider>
          <ProductProvider products={products}>
            <AuthProvider userId={userId} image={image}>
              <div id="popups" className="relative z-[9999]">
                <ToastContainer
                  closeButton={false}
                  hideProgressBar
                  closeOnClick
                  pauseOnFocusLoss
                  pauseOnHover
                  position="top-center"
                  stacked
                  limit={3}
                  transition={Slide}
                  style={{ top: "65px" }}
                />
              </div>
              <PopUp />
              <HeightProvider>
                <Header />
                <Gap z={10} />
                <main className="relative z-10 bg-white px-8 pb-5 pt-8 md:px-20">
                  {children}
                </main>
              </HeightProvider>
              <HeightProvider>
                <Gap z={-9999} />
                <Footer />
              </HeightProvider>
              <ScrollToTop />
            </AuthProvider>
          </ProductProvider>
        </UIStateProvider>
      </body>
    </html>
  );
}
