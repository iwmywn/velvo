import SearchOverlay from "@ui/search/search-overlay";
import { fetchProducts } from "@lib/data";

export default async function SearchOverlayPage() {
  const products = await fetchProducts();
  return <SearchOverlay products={products} />;
}
