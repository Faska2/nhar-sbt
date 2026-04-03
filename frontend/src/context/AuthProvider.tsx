import { useEffect, useMemo, useState } from "react";
import { AuthContext, type AuthState } from "@/context/authContext";
import { loginUser, me, registerUser } from "@/services/auth";
import type { User } from "@/utils/types";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    me(token)
      .then((r) => {
        if (cancelled) return;
        setUser(r.user);
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const value = useMemo<AuthState>(() => {
    return {
      user,
      token,
      loading,
      login: async (input) => {
        const r = await loginUser(input);
        localStorage.setItem("token", r.token);
        setToken(r.token);
        setUser(r.user);
      },
      register: async (input) => {
        const r = await registerUser(input);
        localStorage.setItem("token", r.token);
        setToken(r.token);
        setUser(r.user);
      },
      logout: () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
    };
  }, [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

