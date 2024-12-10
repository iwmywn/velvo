"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userId?: string;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/auth/status", {
        method: "GET",
      });

      if (res.ok) {
        const result = await res.json();
        setIsLoggedIn(result.isLoggedIn);
        if (result.isLoggedIn) {
          setUserId(result.userId);
        }
      }
    }

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
