// src/routes/RedirectIfAuthenticated.tsx
import { Navigate } from "react-router-dom";

import { RootState } from "../store/store";
import { useSelector } from "react-redux";

const RedirectIfAuthenticated = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const token = useSelector((state: RootState) => state.auth.token);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;
