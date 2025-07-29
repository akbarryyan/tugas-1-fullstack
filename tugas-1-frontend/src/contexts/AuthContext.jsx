import { createContext, useContext, useEffect, useState } from "react";

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

  const login = (username, password) => {
    // Static credentials for now
    if (username === "admin" && password === "pastibisa") {
      const userData = {
        id: "admin-001",
        name: "Admin User",
        username: "admin",
        email: "admin@company.com",
        phone: "+62 812-3456-7890",
      };

      const token = "fake-jwt-token-" + Date.now();

      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_data", JSON.stringify(userData));
      setUser(userData);

      return { success: true, message: "Login successful!" };
    }

    return { success: false, message: "Invalid username or password!" };
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    setUser(null);
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
