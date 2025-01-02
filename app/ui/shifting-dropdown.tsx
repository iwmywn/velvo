"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { linkClass } from "@ui/form-class";
import { menItems, womenItems, kidsItems } from "@ui/data";

export const CategoryDropDown = () => {
  return <CategoryTabs />;
};

const CategoryTabs = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [dir, setDir] = useState<null | "l" | "r">(null);
  const [buttonWidths, setButtonWidths] = useState<number[]>([]);
  const observerRef = useRef<ResizeObserver | null>(null);

  const handleSetSelected = (val: number | null) => {
    if (typeof selected === "number" && typeof val === "number") {
      setDir(selected > val ? "r" : "l");
    } else if (val === null) {
      setDir(null);
    }
    setSelected(val);
  };

  const calculateButtonWidths = () => {
    const widths = CATEGORY_TABS.map(({ id }) => {
      const tabElement = document.getElementById(`shift-tab-${id}`);
      return tabElement ? tabElement.getBoundingClientRect().width : 0;
    });
    setButtonWidths(widths);
  };

  useEffect(() => {
    const tabsElements = CATEGORY_TABS.map(({ id }) =>
      document.getElementById(`shift-tab-${id}`),
    ).filter(Boolean) as HTMLElement[];

    observerRef.current = new ResizeObserver(() => calculateButtonWidths());
    tabsElements.forEach((el) => observerRef.current?.observe(el));

    calculateButtonWidths();

    return () => {
      tabsElements.forEach((el) => observerRef.current?.unobserve(el));
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div
      onMouseLeave={() => handleSetSelected(null)}
      className="relative flex h-fit gap-2"
    >
      {CATEGORY_TABS.map(({ id, title }) => (
        <CategoryTab
          key={id}
          selected={selected}
          handleSetSelected={handleSetSelected}
          tab={id}
        >
          {title}
        </CategoryTab>
      ))}

      <AnimatePresence>
        {selected && (
          <CategoryContent
            dir={dir}
            selected={selected}
            buttonWidths={buttonWidths}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const CategoryTab = ({
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
      className={`flex items-center gap-1 text-nowrap px-3 py-1.5 text-sm transition-colors ${
        selected === tab && "opacity-70"
      }`}
    >
      <span className="font-semibold">{children}</span>
      <FiChevronDown
        className={`transition-transform ${selected === tab ? "rotate-180" : ""}`}
      />
    </button>
  );
};

const CategoryContent = ({
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
    const halfFirstButtonWidths: number = buttonWidths[0] / 2;
    const halfSecondButtonWidths: number = buttonWidths[1] / 2;
    const halfThirdButtonWidths: number = buttonWidths[2] / 2;
    let left = halfFirstButtonWidths;

    if (selected === 2) left = buttonWidths[0] + 8 + halfSecondButtonWidths;
    if (selected === 3)
      left = buttonWidths[0] + buttonWidths[1] + 16 + halfThirdButtonWidths;

    return left;
  };

  return (
    <motion.div
      id="overlay-content"
      initial={{
        opacity: 0,
        y: -20,
        x: "-50%",
      }}
      animate={{
        opacity: 1,
        y: 0,
        left: `${calculateLeft()}px`,
      }}
      exit={{
        opacity: 0,
        y: 20,
      }}
      style={{
        left: `${calculateLeft()}px`,
      }}
      className="absolute top-[calc(100%_+_16px)] z-10 max-w-max rounded-lg border bg-white px-6 py-4"
    >
      <Bridge />
      <Nub />

      {CATEGORY_TABS.map((t) => {
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

const Bridge = () => <div className="absolute -top-4 left-0 right-0 h-4" />;

const Nub = () => {
  return (
    <motion.span
      style={{
        clipPath: "polygon(0 0, 100% 0, 50% 50%, 0% 100%)",
        left: "50%",
      }}
      initial={{ x: "-50%", y: "-50%", rotate: 45 }}
      animate={{ left: "50%" }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="absolute top-0 h-4 w-4 rounded-tl border bg-white"
    />
  );
};

interface CategoryLinksProps {
  items: ReadonlyArray<{ label: string; href: string }>;
  sub: string;
}

const CategoryLinks: React.FC<CategoryLinksProps> = ({ items, sub }) => {
  return (
    <div className="flex flex-col items-center gap-3 text-sm">
      {items.map(({ label, href }) => (
        <Link
          key={href}
          href={`/categories/${sub}/${href}`}
          className={`${linkClass} text-nowrap`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
};

const Men = () => {
  return <CategoryLinks items={menItems} sub="men" />;
};

const Women = () => {
  return <CategoryLinks items={womenItems} sub="women" />;
};

const Kids = () => {
  return <CategoryLinks items={kidsItems} sub="kids" />;
};

const CATEGORY_TABS = [
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
