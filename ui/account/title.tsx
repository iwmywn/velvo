export default function Title({ title }: { title: string | React.ReactNode }) {
  return (
    <span className="mb-7 text-center text-2xl font-medium lg:text-3xl">
      {title}
    </span>
  );
}
