import { Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import RedirectIfAuthenticated from "../shared/RedirectIfAuthenticated";
import AuthRoutes from "../shared/AuthRoutes";
import VerifyEmail from "../pages/auth/VerifyEmail";

const AuthRouteGroup = () => (
  <Route path="/auth" element={<AuthRoutes />}>
    <Route
      path="login"
      element={
        <RedirectIfAuthenticated>
          <Login />
        </RedirectIfAuthenticated>
      }
    />
    <Route
      path="register"
      element={
        <RedirectIfAuthenticated>
          <Register />
        </RedirectIfAuthenticated>
      }
    />
    <Route
      path="verify-email"
      element={
        <RedirectIfAuthenticated>
          <VerifyEmail />
        </RedirectIfAuthenticated>
      }
    />
    <Route
      path="register"
      element={
        <RedirectIfAuthenticated>
          <Register />
        </RedirectIfAuthenticated>
      }
    />
    <Route
      path="forgot-password"
      element={
        <RedirectIfAuthenticated>
          <ForgotPassword />
        </RedirectIfAuthenticated>
      }
    />
    <Route
      path="reset-password"
      element={
        <RedirectIfAuthenticated>
          <ResetPassword />
        </RedirectIfAuthenticated>
      }
    />
  </Route>
);

export default AuthRouteGroup;
