import { redirect } from "next/navigation";

export default function RedirectToCart() {
  redirect("/user/purchase?tab=to-pay");
}
