"use client";

import { emptyStates } from "@ui/data/empty-state";

interface EmptyStateProps {
  emptyState: keyof typeof emptyStates;
}

export default function EmptyState({ emptyState }: EmptyStateProps) {
  const { icon, title, description, href, text } = emptyStates[emptyState];

  return (
    <div className="flex min-h-screen flex-col items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="text-gray-500">{icon}</div>
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        <p className="text-center text-gray-500">{description}</p>
        <a
          className="mt-2 rounded-md border border-white bg-black px-5 py-3 text-sm text-white transition-all duration-500 hover:scale-95"
          href={href}
        >
          {text}
        </a>
      </div>
    </div>
  );
}
