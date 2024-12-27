import { useState, useRef, useEffect } from "react";
import { HiMinusSmall, HiPlusSmall } from "react-icons/hi2";

interface ExpandableSectionProps {
  label: string;
  body: string | string[];
  isExpanded: boolean;
  onToggle: (label: string) => void;
}

interface ExpandableSectionsProps {
  sections: { label: string; body: string | string[] }[];
}

export default function ExpandableSections({
  sections,
}: ExpandableSectionsProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleToggle = (label: string) => {
    setExpandedSection((prev) => (prev === label ? null : label));
  };

  return (
    <div className="text-xs">
      {sections.map(({ label, body }) => (
        <ExpandableSection
          key={label}
          label={label}
          body={body}
          isExpanded={expandedSection === label}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}

function ExpandableSection({
  label,
  body,
  isExpanded,
  onToggle,
}: ExpandableSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = useState<string>("0px");

  useEffect(() => {
    if (ref.current) {
      setMaxHeight(isExpanded ? `${ref.current.scrollHeight}px` : "0px");
    }
  }, [isExpanded]);

  return (
    <>
      <div
        onClick={() => onToggle(label)}
        className="flex h-full cursor-pointer items-center justify-between border-b py-2 font-medium"
      >
        <span>{label}</span>
        {isExpanded ? <HiMinusSmall /> : <HiPlusSmall />}
      </div>
      <div
        ref={ref}
        className="transition-max-height mb-1 mt-3 overflow-hidden duration-500 ease-in-out"
        style={{ maxHeight }}
      >
        {Array.isArray(body) ? (
          <ul className="flex list-disc flex-col gap-1 pl-5">
            {body.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>{body}</p>
        )}
      </div>
    </>
  );
}
