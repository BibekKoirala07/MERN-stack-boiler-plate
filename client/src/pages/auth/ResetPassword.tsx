// src/components/ResetPassword.tsx
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../store/features/auth/authApi";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!token) {
      return setError("Invalid or missing token.");
    }

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const res = await resetPassword({
        email,
        token,
        newPassword,
        confirmPassword,
      }).unwrap();
      setMessage(res.message || "Password reset successful.");
    } catch (err: any) {
      setError(err?.data?.message || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && <div>{message}</div>}
      {error && <div>{error}</div>}
      <div>
        <label>New Password:</label>
        <input
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
};

export default ResetPassword;
