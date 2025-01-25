export default function SlidingContainer({
  isAnimating,
  children,
}: {
  isAnimating: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`fixed right-0 bottom-0 left-0 h-[80%] overflow-y-auto rounded-tl-lg rounded-tr-lg bg-white sm:top-0 sm:left-auto sm:h-auto sm:w-[50%] sm:rounded-tr-none sm:rounded-bl-lg lg:w-[33%] ${
        isAnimating
          ? "animate-center-to-bottom sm:animate-left-to-right"
          : "animate-bottom-to-center sm:animate-right-to-left"
      }`}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}
