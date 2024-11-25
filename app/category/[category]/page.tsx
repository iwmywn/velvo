import { notFound } from "next/navigation";

const validCategories = new Set(["men", "women", "kids"]);

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = params;

  if (!validCategories.has(category)) notFound();

  return <div>Category: {category}</div>;
}
