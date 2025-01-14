"use client";

import React, { createContext, useContext, ReactNode } from "react";

interface User {
  userId: string | undefined;
  image: string | undefined;
}

const AuthContext = createContext<User | undefined>(undefined);

export const AuthProvider = ({
  children,
  userId,
  image,
}: {
  children: ReactNode;
  userId: string | undefined;
  image: string | undefined;
}) => {
  return (
    <AuthContext.Provider value={{ userId, image }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
