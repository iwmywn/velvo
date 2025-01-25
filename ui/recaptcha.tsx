"use client";

import ReCAPTCHA from "react-google-recaptcha";
import { createPortal } from "react-dom";
import { useAnimation, useOverflow } from "@ui/hooks";
import showToast from "@ui/toast";

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
  const { isAnimating, triggerAnimation } = useAnimation();
  const animteAndClose = () => triggerAnimation(() => onClose());
  const handleRecaptchaChange = async (token: string | null) => {
    if (!token) {
      showToast("CAPTCHA verification failed! Please try again.", "warning");
      return;
    }

    setRecaptchaToken(token);
    setTimeout(() => {
      animteAndClose();
    }, 500);
  };

  const handleClose = () => {
    animteAndClose();
    showToast("Please complete the CAPTCHA!", "warning");
  };

  //eslint-disable-next-line react-hooks/rules-of-hooks
  if (overflow) useOverflow(!isAnimating);

  return createPortal(
    <div
      className={`fixed inset-0 z-[9998] flex items-center justify-center bg-black/80 ${isAnimating ? "animate-fade-out" : "animate-fadeIn"}`}
      onClick={handleClose}
    >
      <div
        className={`rounded bg-white p-4 shadow-lg ${isAnimating ? "animate-zoom-out" : "animate-zoom-in"}`}
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
