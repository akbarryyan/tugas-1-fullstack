import { createContext, useContext, useEffect, useState } from "react";
import { API_CONFIG, ENDPOINTS } from "../config/api.js";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("user_data");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${ENDPOINTS.AUTH.LOGIN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        const { token, admin } = data.data;

        console.log("Login successful, storing token:", token);
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user_data", JSON.stringify(admin));
        setUser(admin);

        return { success: true, message: data.message };
      }

      return { success: false, message: data.message };
    } catch (error) {
      console.error("Login error:", error);
      const message = "Username atau password salah";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        await fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.AUTH.LOGOUT}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      setUser(null);
    }
  };

  const updateProfile = (newData) => {
    const updatedUser = { ...user, ...newData };
    localStorage.setItem("user_data", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = {
    user,
    login,
    logout,
    updateProfile,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
