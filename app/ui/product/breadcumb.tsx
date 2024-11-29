import Link from "next/link";
import { Fragment } from "react";
import { PiGreaterThanThin } from "react-icons/pi";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  breadcrumb: BreadcrumbItem[];
}
export default function BreadCrumb({ breadcrumb }: BreadcrumbProps) {
  return (
    <div className="mb-10 flex items-center gap-2 text-sm">
      {breadcrumb.map(({ label, href }, index) => (
        <Fragment key={index}>
          {href ? (
            <Link
              href={href}
              className="text-gray-700 transition-colors duration-200 hover:text-black"
            >
              {label}
            </Link>
          ) : (
            <span>{label}</span>
          )}
          {index < breadcrumb.length - 1 && <PiGreaterThanThin />}
        </Fragment>
      ))}
    </div>
  );
}
