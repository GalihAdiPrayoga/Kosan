// AuthProvider.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data.user;
      console.log(data);

      if (res.data.status === "success") {
        setUser(data);
        localStorage.setItem("token", token);
      }
    } catch (error) {
      console.log(error);
      setUser(null);
      localStorage.removeItem("token");
      setToken(null);
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
