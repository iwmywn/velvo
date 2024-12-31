"use client";

import { createContext, useContext, useState } from "react";
import useOverflow from "@ui/hooks/overflow";

type UIStateKeys =
  | "isMenuOpen"
  | "isSearchOpen"
  | "isCartOpen"
  | "isPopupOpen"
  | "isDeliveryInfoOpen"
  | "isConfirmOrderOpen"
  | "isCheckoutOpen";

interface UIStateContextProps {
  state: Record<UIStateKeys, boolean>;
  setState: (key: UIStateKeys, value: boolean) => void;
}

const UIStateContext = createContext<UIStateContextProps | undefined>(
  undefined,
);

export const UIStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setStateInternal] = useState<Record<UIStateKeys, boolean>>({
    isMenuOpen: false,
    isSearchOpen: false,
    isCartOpen: false,
    isPopupOpen: false,
    isDeliveryInfoOpen: false,
    isConfirmOrderOpen: false,
    isCheckoutOpen: false,
  });
  const isAnyOpen = Object.values(state).some((value) => value);
  const setState = (key: UIStateKeys, value: boolean) => {
    setStateInternal((prev) => ({ ...prev, [key]: value }));
  };

  useOverflow(isAnyOpen);

  return (
    <UIStateContext.Provider value={{ state, setState }}>
      {children}
    </UIStateContext.Provider>
  );
};

export const useUIState = () => {
  const cxt = useContext(UIStateContext);
  if (!cxt) {
    throw new Error("useUIState must be used within a UIStateProvider");
  }
  return cxt;
};
