"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ToPay from "@/ui/cart/to-pay";
import Completed from "@/ui/cart/completed";
import Loading from "@/ui/loading";
import useDeviceType from "@/ui/hooks/device-type";
import useHideMenu from "@/ui/hooks/hide-menu";

const tabs = [
  { key: "to-pay", label: "To Pay", component: ToPay },
  { key: "completed", label: "Completed", component: Completed },
] as const;

export default function PurchaseOverview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deviceType = useDeviceType();
  const [activeTabKey, setActiveTabKey] = useState<string | null>(null);
  const [isShowTab, setIsShowTab] = useState<boolean>(false);

  useHideMenu(isShowTab, setIsShowTab);
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
    <div className="relative z-10 overflow-x-auto bg-white">
      {deviceType !== "desktop" ? (
        <div
          className="relative z-20 mx-8 mt-5 min-w-[250px] text-center text-sm md:mx-20"
          onClick={() => setIsShowTab(true)}
        >
          <div className="cursor-pointer border p-2">
            {tabs.find((tab) => tab.key === activeTabKey)?.label}
          </div>
          {isShowTab && (
            <div className="absolute left-0 top-[100%] mt-1 w-full border bg-white shadow-md">
              {tabsHTML}
            </div>
          )}
        </div>
      ) : (
        <div className="mx-8 my-5 grid min-w-[600px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] overflow-hidden border text-center font-medium md:mx-20">
          {tabsHTML}
        </div>
      )}

      {ActiveComponent && (
        <main className="min-h-screen p-8 text-sm md:px-20">
          <ActiveComponent />
        </main>
      )}
    </div>
  );
}
