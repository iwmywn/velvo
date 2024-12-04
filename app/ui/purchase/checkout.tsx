"use client";

import { useState } from "react";
import Button from "../button";
import Backdrop from "@ui/overlays/backdrop";

export default function Checkout() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setIsOpen(false);
    }, 250);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Checkout</Button>
      {isOpen && (
        <Backdrop isAnimating={isAnimating} onClick={handleClose}>
          <div
            className={`overflow-y-auto rounded-lg bg-white p-4 ${
              isAnimating ? "animate-zoomOut" : "animate-zoomIn"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <input type="text" />
          </div>
        </Backdrop>
      )}
    </>
  );
}
