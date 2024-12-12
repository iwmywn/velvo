"use client";

import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";

interface ReCaptchaPopupProps {
  onVerify: () => void;
  onClose: () => void;
}

export default function ReCaptchaPopup({
  onVerify,
  onClose,
}: ReCaptchaPopupProps) {
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
        onVerify();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to verify CAPTCHA! Please try again.");
    } finally {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex animate-fadeIn items-center justify-center bg-black/70"
      onClick={() => {
        onClose();
        toast.error("Please complete the CAPTCHA!");
      }}
    >
      <div
        className="animate-zoomIn rounded bg-white p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA!}
          onChange={handleVerify}
        />
      </div>
    </div>,
    document.getElementById("popups")!,
  );
}
