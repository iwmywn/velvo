"use client";

import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import { useState } from "react";
import useOverflow from "@ui/hooks/overflow";

interface ReCaptchaPopupProps {
  onClose: () => void;
  setRecaptchaToken: (token: string | null) => void;
  overflow?: boolean;
}

export default function ReCaptchaPopup({
  onClose,
  setRecaptchaToken,
  overflow = true,
}: ReCaptchaPopupProps) {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const animteAndClose = () => {
    setIsAnimating(true);
    setTimeout(() => onClose(), 250);
  };
  const handleRecaptchaChange = async (token: string | null) => {
    if (!token) {
      toast.error("CAPTCHA verification failed! Please try again.");
      return;
    }

    setRecaptchaToken(token);
    setTimeout(() => {
      animteAndClose();
    }, 500);
  };

  const handleClose = () => {
    animteAndClose();
    toast.error("Please complete the CAPTCHA!");
  };

  //eslint-disable-next-line react-hooks/rules-of-hooks
  if (overflow) useOverflow(!isAnimating);

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
          onChange={handleRecaptchaChange}
          hl="en"
        />
      </div>
    </div>,
    document.getElementById("popups")!,
  );
}
