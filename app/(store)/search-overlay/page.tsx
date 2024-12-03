"use client";

import { useEffect, useState } from "react";
import Loading from "@/ui/loading";
import { useRouter } from "next/navigation";

export default function RedirectToPreviousPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    router.back();
    setTimeout(() => {
      setLoading(false);
    }, 0);
  }, [router]);

  return loading ? <Loading /> : null;
}
