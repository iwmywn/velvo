"use client";

import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import { useState } from "react";
import useOverflow from "@ui/hooks/overflow";

interface ReCaptchaPopupProps {
  onVerify: () => void;
  onClose: () => void;
}

export default function ReCaptchaPopup({
  onVerify,
  onClose,
}: ReCaptchaPopupProps) {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const animateAndClose = (callback: () => void) => {
    setIsAnimating(true);
    setTimeout(() => callback(), 250);
  };
  const handleVerify = async (token: string | null) => {
    if (!token) {
      toast.error("CAPTCHA verification failed! Please try again.");
      return;
    }

    try {
      const res = await fetch("/api/recaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(token),
      });

      const result = await res.json();

      if (res.ok) {
        animateAndClose(onVerify);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to verify CAPTCHA! Please try again.");
    } finally {
      animateAndClose(onClose);
    }
  };

  const handleClose = () => {
    animateAndClose(onClose);
    toast.error("Please complete the CAPTCHA!");
  };

  useOverflow(!isAnimating);

  return createPortal(
    <div
      className={`fixed inset-0 z-[9998] flex items-center justify-center bg-black/80 ${isAnimating ? "animate-fadeOut" : "animate-fadeIn"}`}
      onClick={handleClose}
    >
      <div
        className={`rounded bg-white p-4 shadow-lg ${isAnimating ? "animate-zoomOut" : "animate-zoomIn"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA!}
          onChange={handleVerify}
          hl="en"
        />
      </div>
    </div>,
    document.getElementById("popups")!,
  );
}
