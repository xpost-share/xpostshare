"use client";
import React, { createContext, useState, ReactNode } from "react";

interface AuthContextProps {
  loginWithAPI: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const loginWithAPI = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(
        "https://xpost-share-backend-app-4jzh5demla-as.a.run.app/api/v1/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage or context
        localStorage.setItem("user", JSON.stringify(data));
        return { success: true };
      } else {
        throw new Error(data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  };

  return (
    <AuthContext.Provider value={{ loginWithAPI }}>
      {children}
    </AuthContext.Provider>
  );
};
