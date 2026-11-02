"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";

export interface AuthUser {
  name: string;
  email: string;
  photoURL?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, name?: string) => void;
  register: (name: string, email: string, password?: string, photoURL?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("booknook_auth_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("booknook_auth_change", callback);
  };
}

function getSnapshot() {
  return localStorage.getItem("booknook_user");
}

function getServerSnapshot() {
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const userJson = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  let user: AuthUser | null = null;
  if (userJson) {
    try {
      user = JSON.parse(userJson);
    } catch {
      user = null;
    }
  }

  // লগইন ফাংশন
  const login = (email: string, name?: string) => {
    const formattedUser: AuthUser = {
      email: email.trim(),
      name: name?.trim() || email.split("@")[0] || "Reader",
    };
    localStorage.setItem("booknook_user", JSON.stringify(formattedUser));
    window.dispatchEvent(new Event("booknook_auth_change"));
  };

  // [NEW AUTH FEATURE]: রেজিস্ট্রেশন ফাংশন
  const register = (name: string, email: string, password?: string, photoURL?: string) => {
    const formattedUser: AuthUser = {
      name: name.trim() || email.split("@")[0] || "Reader",
      email: email.trim(),
      photoURL: photoURL?.trim(),
    };
    localStorage.setItem("booknook_user", JSON.stringify(formattedUser));
    window.dispatchEvent(new Event("booknook_auth_change"));
  };

  // লগআউট ফাংশন
  const logout = () => {
    localStorage.removeItem("booknook_user");
    window.dispatchEvent(new Event("booknook_auth_change"));
  };

  return (
    <AuthContext.Provider value={{ user, loading: false, login, register, logout }}>
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
