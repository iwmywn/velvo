"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Order from "@ui/cart/order";
import OrderHistory from "@ui/cart/order-history";
import Loading from "@/ui/loading";
import useDeviceType from "@/ui/hooks/device-type";
import useHideMenu from "@/ui/hooks/hide-menu";

const tabs = [
  { key: "to-pay", label: "To Pay", component: Order },
  { key: "completed", label: "Completed", component: OrderHistory },
] as const;

export default function PurchaseOverview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deviceType = useDeviceType();
  const [activeTabKey, setActiveTabKey] = useState<string | null>(null);
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);

  useHideMenu(isShowMenu, setIsShowMenu);
  useEffect(() => {
    const tabKey = searchParams.get("tab");
    const validTab = tabs.find(({ key }) => key === tabKey);
    if (!validTab) {
      router.push("/user/purchase");
      setActiveTabKey(tabs[0].key);
    } else setActiveTabKey(validTab.key);
  }, [router, searchParams]);

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
          onClick={() => setIsShowMenu(true)}
        >
          <div className="cursor-pointer rounded-md border p-2">
            {tabs.find((tab) => tab.key === activeTabKey)?.label}
          </div>
          {isShowMenu && (
            <div className="absolute left-0 top-[100%] mt-1 w-full rounded-md border bg-white shadow-md">
              {tabsHTML}
            </div>
          )}
        </div>
      ) : (
        <div className="mx-8 my-5 grid min-w-[600px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] overflow-hidden rounded-md border text-center font-medium md:mx-20">
          {tabsHTML}
        </div>
      )}

      {ActiveComponent && (
        <main className="min-h-screen p-8 md:px-20">
          <div className="text-sm">
            <ActiveComponent />
          </div>
        </main>
      )}
    </div>
  );
}
