"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ToPay from "@/ui/purchase/to-pay";
import Completed from "@/ui/purchase/completed";
import Loading from "@/ui/loading";
import useDeviceType from "@/ui/hooks/device-type";
import useHideMenu from "@/ui/hooks/hide-menu";

const tabs = [
  { key: "to-pay", label: "TO PAY", component: ToPay },
  { key: "completed", label: "COMPLETED", component: Completed },
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
    <div className="overflow-x-auto">
      {deviceType !== "desktop" ? (
        <div
          className="relative z-[11] mb-5 min-w-[250px] text-center text-sm font-medium"
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
        <div className="mb-5 grid min-w-[600px] grid-cols-[1fr_1fr] overflow-hidden border text-center font-medium">
          {tabsHTML}
        </div>
      )}

      {ActiveComponent && (
        <div className="min-h-screen text-sm">
          <ActiveComponent />
        </div>
      )}
    </div>
  );
}
