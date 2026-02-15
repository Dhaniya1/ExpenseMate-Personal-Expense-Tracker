import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import API from "../api/axios";

type AuthContextType = {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  return useContext(AuthContext)!;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // ⭐ new

  // ⭐ Restore token on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const res = await API.post("/auth/token", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    localStorage.setItem("token", res.data.access_token);
    setToken(res.data.access_token);
  };

  const register = async (username: string, password: string) => {
    await API.post("/auth/", {
      username,
      password,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // ⭐ Wait until we check localStorage before rendering routes
  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
