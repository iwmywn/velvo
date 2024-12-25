"use client";

import { ReactNode, useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { linkClass } from "@ui/form-class";

export const ShiftingDropDown = () => {
  return <Tabs />;
};

const Tabs = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [dir, setDir] = useState<null | "l" | "r">(null);

  const handleSetSelected = (val: number | null) => {
    if (typeof selected === "number" && typeof val === "number") {
      setDir(selected > val ? "r" : "l");
    } else if (val === null) {
      setDir(null);
    }

    setSelected(val);
  };

  return (
    <div
      onMouseLeave={() => handleSetSelected(null)}
      className="relative flex h-fit gap-2"
    >
      {TABS.map((t) => {
        return (
          <Tab
            key={t.id}
            selected={selected}
            handleSetSelected={handleSetSelected}
            tab={t.id}
          >
            {t.title}
          </Tab>
        );
      })}

      <AnimatePresence>
        {selected && <Content dir={dir} selected={selected} />}
      </AnimatePresence>
    </div>
  );
};

const Tab = ({
  children,
  tab,
  handleSetSelected,
  selected,
}: {
  children: ReactNode;
  tab: number;
  handleSetSelected: (val: number | null) => void;
  selected: number | null;
}) => {
  return (
    <button
      id={`shift-tab-${tab}`}
      onMouseEnter={() => handleSetSelected(tab)}
      onClick={() => handleSetSelected(tab)}
      className={`flex items-center gap-1 px-3 py-1.5 text-sm transition-colors ${
        selected === tab && "opacity-70"
      }`}
    >
      <span>{children}</span>
      <FiChevronDown
        className={`transition-transform ${
          selected === tab ? "rotate-180" : ""
        }`}
      />
    </button>
  );
};

const Content = ({
  selected,
  dir,
}: {
  selected: number | null;
  dir: null | "l" | "r";
}) => {
  return (
    <motion.div
      id="overlay-content"
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 8,
      }}
      className="absolute left-0 top-[calc(100%_+_20px)] max-w-max rounded-lg border border-black/50 bg-gradient-to-b from-slate-50 via-slate-50 to-white p-4"
    >
      <Bridge />
      <Nub selected={selected} />

      {TABS.map((t) => {
        return (
          <div className="overflow-hidden" key={t.id}>
            {selected === t.id && (
              <motion.div
                initial={{
                  opacity: 0,
                  x: dir === "l" ? 100 : dir === "r" ? -100 : 0,
                }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <t.Component />
              </motion.div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
};

const Bridge = () => <div className="absolute -top-5 left-0 right-0 h-5" />;

const Nub = ({ selected }: { selected: number | null }) => {
  const [left, setLeft] = useState<number>(0);

  useEffect(() => {
    moveNub();
  }, [selected]);

  const moveNub = () => {
    if (selected) {
      const hoveredTab = document.getElementById(`shift-tab-${selected}`);
      const overlayContent = document.getElementById("overlay-content");

      if (!hoveredTab || !overlayContent) return;

      const tabRect = hoveredTab.getBoundingClientRect();
      const { left: contentLeft } = overlayContent.getBoundingClientRect();

      const tabCenter = tabRect.left + tabRect.width / 2 - contentLeft;

      setLeft(tabCenter);
    }
  };

  return (
    <motion.span
      style={{
        clipPath: "polygon(0 0, 100% 0, 50% 50%, 0% 100%)",
      }}
      animate={{ left }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-tl border border-black/50 bg-white"
    />
  );
};

const Men = () => {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <Link href="#" className={`${linkClass}`}>
        Men
      </Link>
      <Link href="#" className={`${linkClass}`}>
        Men
      </Link>
    </div>
  );
};

const Women = () => {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <Link href="#" className={`${linkClass}`}>
        Women
      </Link>
      <Link href="#" className={`${linkClass}`}>
        Women
      </Link>
    </div>
  );
};

const Kids = () => {
  return (
    <div>
      <div className="flex flex-col gap-2 text-sm">
        <Link href="#" className={`${linkClass}`}>
          Kids
        </Link>
        <Link href="#" className={`${linkClass}`}>
          Kids
        </Link>
      </div>
    </div>
  );
};

const TABS = [
  {
    title: "MEN",
    Component: Men,
  },
  {
    title: "WOMEN",
    Component: Women,
  },
  {
    title: "KIDS",
    Component: Kids,
  },
].map((n, idx) => ({ ...n, id: idx + 1 }));
