import { createContext, useContext, useState } from "react";
import { type User } from "../types/user";
import React from "react";
type AuthContextType = {
  user: User | null;
  setUser: (param: User | null) => void;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);
type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) {
      return JSON.parse(saved);
    }
    return null;
  });
  function handleSetUser(newUser: User | null) {
    if (newUser) {
      const { passwordHash, ...safeUser } = newUser;
      setUser(safeUser);
      localStorage.setItem("currentUser", JSON.stringify(safeUser));
    } else {
      setUser(null);
      localStorage.removeItem("currentUser");
    }
  }
  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser }}>
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
