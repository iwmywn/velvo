"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  isSignedIn: boolean;
  userId?: string;
}

const AuthContext = createContext<AuthContextType>({
  isSignedIn: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/auth/status", {
        method: "GET",
      });

      if (res.ok) {
        const result: AuthContextType = await res.json();
        setIsSignedIn(result.isSignedIn);
        setUserId(result.userId);
      }
    }

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isSignedIn, userId }}>
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
