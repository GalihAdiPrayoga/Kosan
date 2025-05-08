import { createContext } from "react";

const AuthContext = createContext({
  user: null,
  token: null,
  setToken: () => {},
  setUser: () => {},
});

export default AuthContext;
