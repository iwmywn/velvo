import { emptyStates } from "@ui/data/empty-state";
import { GiShoppingCart } from "react-icons/gi";
import Link from "next/link";

interface EmptyStateProps {
  emptyState: keyof typeof emptyStates;
}

export default function EmptyState({ emptyState }: EmptyStateProps) {
  const { title, description } = emptyStates[emptyState];

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center gap-4">
        <div>
          <GiShoppingCart fontSize={50} />
        </div>
        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
        <p className="text-center text-gray-500">{description}</p>
        <Link
          className="mt-2 rounded-md border border-white bg-black px-5 py-3 text-sm text-white transition-all duration-500 hover:scale-95"
          href="/"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
