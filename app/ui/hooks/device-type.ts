"use client";

import { useState, useEffect } from "react";

export default function useDeviceType(): "desktop" | "other" {
  const [deviceType, setDeviceType] = useState<"desktop" | "other">("desktop");

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isMobileOrTablet = /Mobi|Android|iPhone|iPad|iPod|Tablet/i.test(
      userAgent,
    );

    setDeviceType(isMobileOrTablet ? "other" : "desktop");
  }, []);

  return deviceType;
}
