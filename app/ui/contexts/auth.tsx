"use client";

import React, { createContext, useContext, ReactNode } from "react";

interface User {
  userId: string | undefined;
  userImage: string | undefined;
}

const AuthContext = createContext<User | undefined>(undefined);

export const AuthProvider = ({
  children,
  userId,
  userImage,
}: {
  children: ReactNode;
  userId: string | undefined;
  userImage: string | undefined;
}) => {
  return (
    <AuthContext.Provider value={{ userId, userImage }}>
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
