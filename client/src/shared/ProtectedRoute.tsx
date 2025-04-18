import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
