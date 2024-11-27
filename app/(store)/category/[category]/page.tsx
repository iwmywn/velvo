import { notFound } from "next/navigation";
import { Metadata } from "next";

const validCategories = new Set(["men", "women", "kids"]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const category = (await params).category;
  return {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} Category`,
  };
}

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
