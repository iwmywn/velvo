import type { Metadata } from "next";
import "@/app/globals.css";
import { montserrat } from "@ui/fonts";
import Header from "@ui/header";
import Footer from "@ui/footer";
import ScrollToTop from "@ui/to-top";
import { HeightProvider } from "@ui/hooks/height";
import { CartProvider } from "@ui/context/cart";
import Gap from "@ui/gap";
import PopUp from "@ui/pop-up";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@ui/context/auth";
import { ToastContainer } from "react-toastify";
import { siteConfig } from "@lib/config";
import { ProductProvider } from "@ui/context/product";
import { fetchProducts } from "@lib/data";
import { UIStateProvider } from "@ui/context/state";

export const metadata: Metadata = {
  title: {
    template: "%s - StyleWave",
    default: siteConfig.maintenanceMode
      ? "Maintenance - StyleWave"
      : "StyleWave",
  },
  description: siteConfig.maintenanceMode
    ? "Website is under maintenance"
    : "StyleWave is your ultimate online fashion destination, offering a wide range of high-quality clothing that caters to every style. From trendy streetwear to elegant pieces, we bring you the latest fashion trends to keep your wardrobe fresh and stylish.",
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
            <div className="flex min-h-screen items-center justify-center text-3xl font-bold">
              Be right back!
            </div>
          </UIStateProvider>
        </body>
      </html>
    );
  }

  const products = await fetchProducts();

  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <UIStateProvider>
          <ProductProvider products={products}>
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
          </ProductProvider>
        </UIStateProvider>
      </body>
    </html>
  );
}
