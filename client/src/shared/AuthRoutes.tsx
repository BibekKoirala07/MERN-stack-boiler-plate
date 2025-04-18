import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

const AuthRoutes = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthRoutes;
