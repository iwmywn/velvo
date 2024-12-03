"use client";

import { useEffect, useState } from "react";
import Loading from "@/ui/loading";

export default function RedirectToPreviousPage() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    window.history.back();
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 200);
    return () => clearTimeout(timeoutId);
  }, []);

  return loading ? <Loading /> : null;
}
