import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My purchase",
};

export default function PurchaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
