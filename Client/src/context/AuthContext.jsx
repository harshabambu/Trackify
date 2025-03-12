import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch("https://trackify-lemon.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      console.log("✅ User logged in:", data);
      setUser({ ...data, userId: data.userId || data._id });
      localStorage.setItem("user", JSON.stringify({ ...data, userId: data.userId || data._id }));
      
      navigate("/dashboard"); // 🔥 Redirect after login
    } catch (error) {
      console.error("🚨 Login error:", error.message);
      throw error;
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await fetch("https://trackify-lemon.vercel.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      navigate("/login");
    } catch (error) {
      console.error("🚨 Signup error:", error.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
