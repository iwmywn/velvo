"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ToPay from "@/ui/purchase/to-pay";
import ToShipAndReceive from "@/ui/purchase/to-ship-receive";
import Completed from "@/ui/purchase/completed";
import Cancelled from "@/ui/purchase/cancelled";
import Loading from "@/ui/loading";
import useHideMenu from "@/ui/hooks/hide-menu";

const tabs = [
  { key: "to-pay", label: "TO PAY", component: ToPay },
  {
    key: "to-ship-and-receive",
    label: "TO SHIP & RECEIVE",
    component: ToShipAndReceive,
  },
  { key: "completed", label: "COMPLETED", component: Completed },
  { key: "cancelled", label: "CANCELLED", component: Cancelled },
] as const;

export default function PurchaseOverview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTabKey, setActiveTabKey] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useHideMenu(isOpen, setIsOpen);
  useEffect(() => {
    if (window.location.pathname !== "/cart-overlay") {
      const tabKey = searchParams.get("tab");
      const validTab = tabs.find(({ key }) => key === tabKey);
      setActiveTabKey(validTab ? validTab.key : tabs[0].key);
    }
  }, [searchParams]);

  if (!activeTabKey) {
    return <Loading />;
  }

  const activeTab = tabs.find((tab) => tab.key === activeTabKey);
  const ActiveComponent = activeTab?.component;
  const tabsHTML = tabs.map(({ key, label }) => (
    <div
      key={key}
      className={`cursor-pointer whitespace-nowrap p-2 text-sm transition-all duration-300 ${
        activeTabKey === key ? "bg-stone-100" : "hover:bg-gray-100"
      }`}
      onClick={() => {
        if (activeTabKey !== key) {
          router.push(`?tab=${key}`);
          setActiveTabKey(key);
        }
      }}
    >
      {label}
    </div>
  ));

  return (
    <div className="overflow-x-auto">
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

      {ActiveComponent && (
        <div className="min-h-screen text-sm">
          <ActiveComponent />
        </div>
      )}
    </div>
  );
}
