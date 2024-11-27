"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Order from "@ui/cart/order";
import OrderHistory from "@ui/cart/order-history";
import useWindowHeight from "@/ui/hooks/window-heights";
import Loading from "@/ui/loading";

const tabs = [
  { key: "to-pay", label: "To Pay", component: Order },
  { key: "completed", label: "Completed", component: OrderHistory },
] as const;

function PurchaseContent() {
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
    if (activeTabKey !== key) {
      router.push(`?tab=${key}`);
      setActiveTabKey(key);
    }
  };

  if (!activeTabKey) {
    return <Loading />;
  }

  const activeTab = tabs.find((tab) => tab.key === activeTabKey);
  const ActiveComponent = activeTab?.component;

  return (
    <div className="relative z-10 overflow-x-auto bg-white">
      <div className="mx-8 my-5 grid min-w-[600px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] overflow-hidden rounded-md border text-center font-medium md:mx-20">
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

export default function PurchasePage() {
  return (
    <Suspense fallback={<Loading />}>
      <PurchaseContent />
    </Suspense>
  );
}
