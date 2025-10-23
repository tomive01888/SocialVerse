"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { UserProfile } from "@/lib/types";
import toast from "react-hot-toast";

interface AuthContextType {
  accessToken: string | null;
  userProfile: UserProfile | null;
  login: (token: string, profile: UserProfile) => void;
  logout: () => void;
  isLoading: boolean;
  isNewLogin: boolean;
  setIsNewLogin: (isNew: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewLogin, setIsNewLogin] = useState(false);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("accessToken");
      const storedProfileJSON = localStorage.getItem("userProfile");

      if (storedToken && storedProfileJSON) {
        const storedProfile: UserProfile = JSON.parse(storedProfileJSON);
        setAccessToken(storedToken);
        setUserProfile(storedProfile);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error("Could not restore your session. Please log in again.");
      toast.error(errorMessage);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userProfile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (token: string, profile: UserProfile) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setAccessToken(token);
    setUserProfile(profile);
    setIsNewLogin(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userProfile");
    setAccessToken(null);
    setUserProfile(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        userProfile,
        login,
        logout,
        isLoading,
        isNewLogin,
        setIsNewLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
