export default function SlidingContainer({
  isAnimating,
  children,
}: {
  isAnimating: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 h-[80%] overflow-y-auto rounded-tl-lg rounded-tr-lg bg-white sm:left-auto sm:top-0 sm:h-auto sm:w-[50%] sm:rounded-bl-lg sm:rounded-tr-none lg:w-[33%] ${
        isAnimating
          ? "animate-centerToBottom sm:animate-leftToRight"
          : "animate-bottomToCenter sm:animate-rightToLeft"
      }`}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}
