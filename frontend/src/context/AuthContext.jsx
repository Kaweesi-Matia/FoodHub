import { createContext, useContext, useEffect, useState } from "react";
import { fetchMe, loginUser, logoutUser, registerUser } from "../api/authApi.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, check whether an auth cookie session already exists
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchMe();
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    setUser(res.data);
    return res.data;
  };

  const register = async (payload) => {
    const res = await registerUser(payload);
    setUser(res.data);
    return res.data;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const refreshUser = async () => {
    const res = await fetchMe();
    setUser(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
