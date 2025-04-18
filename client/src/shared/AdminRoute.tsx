import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../store/store";

const AdminRoute = () => {
  const role = useSelector((state: RootState) => state.auth.user.role);

  const isAdmin = role === "admin";

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
