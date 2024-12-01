import { redirect } from "next/navigation";

export default function RedirectToPurchase() {
  redirect("/user/purchase?tab=to-pay");
}
