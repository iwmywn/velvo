"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Order from "@ui/cart/order";
import OrderHistory from "@ui/cart/order-history";
import useWindowHeight from "@/ui/hooks/window-heights";

const tabs = [
  { key: "to-pay", label: "To Pay", component: Order },
  { key: "completed", label: "Completed", component: OrderHistory },
] as const;

export default function PurchasePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTabKey, setActiveTabKey] = useState<string | null>(null);
  const minHeight = useWindowHeight();

  useEffect(() => {
    const tabKey = searchParams.get("tab");
    const validTab = tabs.find(({ key }) => key === tabKey);
    setActiveTabKey(validTab ? validTab.key : tabs[0].key);
  }, [searchParams]);

  const handleTabClick = (key: string) => {
    router.push(`?tab=${key}`);
    setActiveTabKey(key);
  };

  if (!activeTabKey) {
    return (
      <div className="relative z-10 flex h-screen justify-center bg-white pt-52">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  const activeTab = tabs.find((tab) => tab.key === activeTabKey);
  const ActiveComponent = activeTab?.component;

  return (
    <div className="relative z-10 overflow-x-auto bg-white">
      <div className="mx-8 my-5 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] overflow-hidden rounded-md border text-center font-medium md:mx-20">
        {tabs.map(({ key, label }) => (
          <div
            key={key}
            className={`cursor-pointer whitespace-nowrap p-2 text-sm ${
              activeTabKey === key
                ? "bg-stone-100"
                : "transition-all duration-300 hover:bg-stone-100"
            }`}
            onClick={() => handleTabClick(key)}
          >
            {label}
          </div>
        ))}
      </div>

      {ActiveComponent && (
        <main
          className="p-8 md:px-20"
          style={{ minHeight: minHeight ? `${minHeight}px` : undefined }}
        >
          <ActiveComponent />
        </main>
      )}
    </div>
  );
}
