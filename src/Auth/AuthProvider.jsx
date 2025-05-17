import axios from "axios";
import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;
      if (data.role) {
        localStorage.setItem("userType", data.role);
        if (data.role === "pemilik") localStorage.setItem("isPemilik", "true");
        if (data.role === "admin") localStorage.setItem("isAdmin", "true");
      }

      setUser(data);
      localStorage.setItem("token", token);
      localStorage.setItem("isLoggedIn", "true");
    } catch (error) {
      console.log("AuthProvider error:", error);
      setUser(null);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getData();
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
