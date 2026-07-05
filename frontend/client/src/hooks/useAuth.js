import { useSelector } from "react-redux";

export const useAuth = () => {
  const { user, isAuthenticated, status, bootstrapped } = useSelector((state) => state.auth);
  return {
    user,
    isAuthenticated,
    isAdmin: user?.role === "admin",
    status,
    bootstrapped,
  };
};
