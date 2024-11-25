import { notFound } from "next/navigation";

const validCategories = new Set(["men", "women", "kids"]);

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const category = (await params).category;

  if (!validCategories.has(category)) notFound();

  return <div>Category: {category}</div>;
}

export async function generateStaticParams() {
  return Array.from(validCategories).map((category) => ({
    category,
  }));
}
