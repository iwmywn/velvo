import { emptyStates } from "@ui/data";
import { GiShoppingCart } from "react-icons/gi";
import Link from "next/link";
import Button from "@ui/button";

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
        <Link href="/">
          <Button>Continue shopping</Button>
        </Link>
      </div>
    </div>
  );
}
