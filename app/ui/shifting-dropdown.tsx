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
  const [buttonWidths, setButtonWidths] = useState<number[]>([]);

  const handleSetSelected = (val: number | null) => {
    if (typeof selected === "number" && typeof val === "number") {
      setDir(selected > val ? "r" : "l");
    } else if (val === null) {
      setDir(null);
    }

    setSelected(val);
  };

  useEffect(() => {
    const widths = TABS.map((_, idx) => {
      const tabElement = document.getElementById(`shift-tab-${idx + 1}`);
      return tabElement ? tabElement.getBoundingClientRect().width : 0;
    });
    setButtonWidths(widths);
  }, []);

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
        {selected && (
          <Content dir={dir} selected={selected} buttonWidths={buttonWidths} />
        )}
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
        className={`transition-transform ${selected === tab ? "rotate-180" : ""}`}
      />
    </button>
  );
};

const Content = ({
  selected,
  dir,
  buttonWidths,
}: {
  selected: number | null;
  dir: null | "l" | "r";
  buttonWidths: number[];
}) => {
  const calculateLeft = (): number => {
    if (selected === null) return 0;
    let left = 0;

    if (selected === 2) left = buttonWidths[0] + 8;
    if (selected === 3) left = buttonWidths[0] + buttonWidths[1] + 16;

    return left;
  };

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
        left: `${calculateLeft()}px`,
      }}
      exit={{
        opacity: 0,
        y: 8,
      }}
      style={{
        left: `${calculateLeft()}px`,
      }}
      className="absolute top-[calc(100%_+_20px)] max-w-max rounded-lg border border-black/50 bg-gradient-to-b from-slate-50 via-slate-50 to-white p-4"
    >
      <Bridge />
      <Nub />

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

const Nub = () => {
  return (
    <motion.span
      style={{
        clipPath: "polygon(0 0, 100% 0, 50% 50%, 0% 100%)",
      }}
      animate={{ left: "50%" }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="absolute top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-tl border border-black/50 bg-white"
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
