"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Order from "@ui/cart/order";
import OrderHistory from "@ui/cart/order-history";
import useWindowHeight from "@/ui/hooks/window-heights";
import Loading from "@/ui/loading";
import useDeviceType from "@/ui/hooks/device-type";
import useHideMenu from "@/ui/hooks/hide-menu";

const tabs = [
  { key: "to-pay", label: "To Pay", component: Order },
  { key: "completed", label: "Completed", component: OrderHistory },
] as const;

function PurchaseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTabKey, setActiveTabKey] = useState<string | null>(null);
  const minHeight = useWindowHeight();
  const deviceType = useDeviceType();
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);

  useHideMenu(isShowMenu, setIsShowMenu);
  useEffect(() => {
    const tabKey = searchParams.get("tab");
    const validTab = tabs.find(({ key }) => key === tabKey);
    setActiveTabKey(validTab ? validTab.key : tabs[0].key);
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
          className="relative mx-8 my-5 text-center text-sm md:mx-20"
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
