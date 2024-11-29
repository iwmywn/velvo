import { notFound } from "next/navigation";
import { Metadata } from "next";
import { categories, products } from "@/lib/placeholder-data";
import ProductDetails from "@/ui/product/details";
import SimilarProducts from "@/ui/product/similar";
import BreadCrumb from "@/ui/product/breadcumb";
import { capitalizeFirstLetter } from "@/utils/format-text";
import { Product } from "@/lib/definition";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const productId = parseInt((await params).id);
  const name = products.find((p) => p.id === productId)?.name;

  if (!name) notFound();

  return {
    title: name,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const productId = parseInt((await params).id);

  const product = products.find((p) => p.id === productId);
  const category = categories.find((cat) => cat.id === product?.category_id);
  const similarProducts: Product[] = products.filter(
    (p) => p.category_id === category?.id && p.id !== productId,
  );

  if (!product) notFound();

  const { name } = product;
  const breadcrumb = [
    { label: "All Products", href: "/products" },
    {
      label: `${capitalizeFirstLetter(category?.name ?? "Category")}`,
      href: `/category/${category?.name ?? "unknown"}`,
    },
    { label: name },
  ];

  return (
    <div className="relative z-10 min-h-[90vh] bg-white px-8 pt-8 md:px-10 lg:px-20">
      <BreadCrumb breadcrumb={breadcrumb} />

      <ProductDetails product={product} />

      <SimilarProducts similarProducts={similarProducts} />
    </div>
  );
}
