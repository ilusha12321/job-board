import { createContext, useContext, useState, useEffect } from "react";
import { type User } from "../types/user";
import { getCurrentUser, logoutUser } from "../services/authApi";
import React from "react";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  setUser: (param: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };
    loadUser();
  }, []);

  async function handleSetUser(newUser: User | null) {
    if (newUser) {
      setUser(newUser);
    } else {
      await logoutUser();
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser: handleSetUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
