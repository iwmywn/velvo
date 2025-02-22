"use client";

import { ReactNode, useEffect, useMemo, useRef, useState, FC } from "react";
import { FiChevronDown } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { linkClass } from "@ui/form-class";
import { capitalizeFirstLetter } from "@ui/utils";
import { useStoreContext } from "./contexts";

export const CategoryDropDown = () => {
  return <CategoryTabs />;
};

const CategoryTabs = () => {
  const { categories } = useStoreContext();

  const CATEGORY_TABS = useMemo(
    () =>
      categories.map(({ group, items }, idx) => ({
        title: group,
        Component: () => <CategoryLinks group={group} items={items} />,
        id: idx + 1,
      })),
    [categories],
  );

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
            categoryTabs={CATEGORY_TABS}
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
      className={`flex items-center gap-1 px-3 py-1.5 text-sm text-nowrap uppercase transition-colors ${
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
  categoryTabs,
}: {
  selected: number | null;
  dir: null | "l" | "r";
  buttonWidths: number[];
  categoryTabs: { title: string; Component: FC; id: number }[];
}) => {
  const calculateLeft = (): number => {
    if (selected === null || selected < 1 || selected > buttonWidths.length)
      return 0;

    const halfCurrentButtonWidth = buttonWidths[selected - 1] / 2;

    const left = buttonWidths
      .slice(0, selected - 1)
      .reduce((sum, width) => sum + width + 8, 0);

    return left + halfCurrentButtonWidth;
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

      {categoryTabs.map((t) => {
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

const Bridge = () => <div className="absolute -top-4 right-0 left-0 h-4" />;

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
  group: string;
  items: ReadonlyArray<string>;
}

const CategoryLinks: React.FC<CategoryLinksProps> = ({ group, items }) => {
  return (
    <div className="flex flex-col items-center gap-3 text-sm">
      {items.map((item) => (
        <Link
          key={item}
          href={`/${group}/${item}`}
          className={`${linkClass} text-nowrap`}
        >
          {capitalizeFirstLetter(item)}
        </Link>
      ))}
    </div>
  );
};
