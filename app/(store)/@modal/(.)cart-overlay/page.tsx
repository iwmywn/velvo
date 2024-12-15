import CartOverlay from "@ui/cart/cart-overlay";
import { fetchCartProducts } from "@lib/data";
import { getUserId } from "@api/auth";

export default async function CartOverlayPage() {
  const userId = await getUserId();
  const cartProducts = await fetchCartProducts(userId);

  return <CartOverlay cartProducts={cartProducts} />;
}
