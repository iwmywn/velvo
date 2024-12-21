"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ToPay from "@ui/purchase/to-pay";
import ToShipAndReceive from "@ui/purchase/to-ship-receive";
import Completed from "@ui/purchase/completed";
import Cancelled from "@ui/purchase/cancelled";
import Loading from "@ui/loading";
import useHideMenu from "@ui/hooks/hide-menu";
import BreadCrumbs from "@ui/breadcrumbs";
import { useCartContext } from "@ui/hooks/cart";

const tabs = [
  { key: "to-pay", label: "TO PAY" },
  {
    key: "to-ship-and-receive",
    label: "TO SHIP & RECEIVE",
  },
  { key: "completed", label: "COMPLETED" },
  { key: "cancelled", label: "CANCELLED" },
] as const;

const breadcrumbs = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "My purchase",
  },
];

export default function PurchaseOverview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTabKey, setActiveTabKey] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { cartProducts, invoiceProducts } = useCartContext();

  useHideMenu(setIsOpen);
  useEffect(() => {
    if (
      window.location.pathname !== "/cart-overlay" &&
      window.location.pathname !== "/search-overlay"
    ) {
      const tabKey = searchParams?.get("tab");
      const validTab = tabs.find(({ key }) => key === tabKey);
      setActiveTabKey(validTab ? validTab.key : tabs[0].key);
    }
  }, [searchParams]);

  if (!activeTabKey) {
    return <Loading />;
  }

  const activeTab = tabs.find((tab) => tab.key === activeTabKey);
  const tabsHTML = tabs.map(({ key, label }) => (
    <div
      key={key}
      className={`cursor-pointer whitespace-nowrap p-2 text-sm transition-all duration-300 ${
        activeTabKey === key ? "bg-slate-100" : "hover:bg-slate-100"
      }`}
      onClick={() => {
        if (activeTabKey !== key) {
          router.push(`?tab=${key}`);
        }
      }}
    >
      {label}
    </div>
  ));

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <div className="mt-5 overflow-x-auto">
        <div
          className="relative z-[11] mb-5 block min-w-[250px] text-center text-sm font-medium lg:hidden"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          <div className="cursor-pointer border p-2">
            {tabs.find((tab) => tab.key === activeTabKey)?.label}
          </div>
          {isOpen && (
            <div className="absolute left-0 top-[100%] mt-1 w-full border bg-white shadow-md">
              {tabsHTML}
            </div>
          )}
        </div>
        <div className="mb-5 hidden grid-cols-[1fr_1fr_1fr_1fr] overflow-hidden border text-center font-medium lg:grid">
          {tabsHTML}
        </div>

        {activeTab && (
          <div className="min-h-screen text-sm">
            {activeTab.key === "to-pay" ? (
              <ToPay cartProducts={cartProducts} />
            ) : activeTab.key === "to-ship-and-receive" ? (
              <ToShipAndReceive invoiceProducts={invoiceProducts} />
            ) : activeTab.key === "completed" ? (
              <Completed invoiceProducts={invoiceProducts} />
            ) : (
              <Cancelled invoiceProducts={invoiceProducts} />
            )}
          </div>
        )}
      </div>
    </>
  );
}
