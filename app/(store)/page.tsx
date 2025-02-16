import { getCollections } from "@lib/data";
import Home from "@ui/homepage";

export default async function HomePage() {
  const collections = await getCollections();

  return <Home collections={collections} />;
}
