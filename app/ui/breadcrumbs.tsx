import Link from "next/link";
import { Fragment } from "react";
import { PiGreaterThanThin } from "react-icons/pi";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  breadcrumbs: BreadcrumbItem[];
}

export default function BreadCrumbs({ breadcrumbs }: BreadcrumbsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {breadcrumbs.map(
        ({ label, href }, index) =>
          label !== "false" && (
            <Fragment key={index}>
              {href ? (
                <Link
                  href={href}
                  className="opacity-65 transition-all duration-300 hover:opacity-100"
                >
                  {label}
                </Link>
              ) : (
                <span>{label}</span>
              )}
              {index < breadcrumbs.length - 1 && <PiGreaterThanThin />}
            </Fragment>
          ),
      )}
    </div>
  );
}
