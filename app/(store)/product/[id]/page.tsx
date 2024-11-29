import { notFound } from "next/navigation";
import { Metadata } from "next";
import { productsByCategory } from "@/lib/placeholder-data";
import ProductDetails from "@/ui/product/details";
import SimilarProducts from "@/ui/product/similar";
import BreadCrumb from "@/ui/product/breadcumb";
import { capitalizeFirstLetter } from "@/utils/format-text";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const productId = parseInt((await params).id);

  let product = null;
  for (const category in productsByCategory) {
    product = productsByCategory[category].find((p) => p.id === productId);
    if (product) break;
  }

  if (!product) notFound();

  return {
    title: product.name,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const productId = parseInt((await params).id);

  let product = null;
  let category: string = "";
  for (const cat in productsByCategory) {
    const foundProduct = productsByCategory[cat].find(
      (p) => p.id === productId,
    );
    if (foundProduct) {
      product = foundProduct;
      category = cat;
      break;
    }
  }

  if (!product) notFound();

  const { name, priceCents, saleOff, images } = product;
  const breadcrumb = [
    { label: "All Products", href: "/products" },
    {
      label: `${capitalizeFirstLetter(category)}` || "Category",
      href: `/category/${category}`,
    },
    { label: name },
  ];

  return (
    <div className="relative z-10 min-h-[90vh] bg-white px-8 pt-8 md:px-10 lg:px-20">
      <BreadCrumb breadcrumb={breadcrumb} />

      <ProductDetails
        name={name}
        priceCents={priceCents}
        saleOff={saleOff}
        images={images}
      />

      <SimilarProducts
        currentCategory={category!}
        currentProductId={productId}
      />
    </div>
  );
}
