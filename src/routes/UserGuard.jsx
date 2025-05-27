import { Navigate } from "react-router-dom";

const UserGuard = ({ children }) => {
  return children; // Langsung return children tanpa pengecekan
};

export default UserGuard;
