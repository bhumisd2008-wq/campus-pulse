"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { UserProfile } from "@/types";
import { supabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/services/notices";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isSupabaseAuth: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = "campus_pulse_local_user";

const DEFAULT_GUEST_USER: UserProfile = {
  id: "student-alex-001",
  fullName: "Alex Johnson",
  email: "alex.johnson@university.edu",
  role: "student",
  department: "Computer Science & IT",
  semester: "6",
  rollNumber: "CS2021045",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isSupa = isSupabaseConfigured();

  const loadLocalUser = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(LOCAL_USER_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(DEFAULT_GUEST_USER));
        setUser(DEFAULT_GUEST_USER);
      }
    } catch {
      setUser(DEFAULT_GUEST_USER);
    }
  }, []);

  useEffect(() => {
    async function initAuth() {
      if (isSupa) {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              fullName: session.user.user_metadata?.full_name || "Campus Student",
              role: "student",
              department: "Computer Science & IT",
              semester: "6",
            });
          } else {
            setUser(null);
          }

          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
              setUser({
                id: session.user.id,
                email: session.user.email || "",
                fullName: session.user.user_metadata?.full_name || "Campus Student",
                role: "student",
                department: "Computer Science & IT",
                semester: "6",
              });
            } else {
              setUser(null);
            }
          });

          return () => {
            subscription.unsubscribe();
          };
        } catch (err) {
          console.warn("Supabase auth init failed, fallback to local:", err);
          loadLocalUser();
        } finally {
          setLoading(false);
        }
      } else {
        loadLocalUser();
        setLoading(false);
      }
    }

    initAuth();
  }, [isSupa, loadLocalUser]);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    if (isSupa) {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: error.message };
        return {};
      } catch (err: unknown) {
        return { error: (err as Error).message || "Failed to sign in." };
      }
    }

    if (!email || !password) return { error: "Please enter email and password" };
    const localUser: UserProfile = {
      ...DEFAULT_GUEST_USER,
      email,
      fullName: email.split("@")[0].replace(".", " "),
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
    setUser(localUser);
    return {};
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ error?: string }> => {
    if (isSupa) {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) return { error: error.message };
        return {};
      } catch (err: unknown) {
        return { error: (err as Error).message || "Failed to sign up." };
      }
    }

    if (!email || !password || !fullName) return { error: "All fields are required" };
    const newUser: UserProfile = {
      id: `local-user-${Date.now()}`,
      email,
      fullName,
      role: "student",
      department: "Computer Science & IT",
      semester: "6",
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return {};
  };

  const signOut = async () => {
    if (isSupa) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSupabaseAuth: isSupa,
        signIn,
        signUp,
        signOut,
      }}
    >
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
