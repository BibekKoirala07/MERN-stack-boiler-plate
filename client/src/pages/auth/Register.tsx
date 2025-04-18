// src/components/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../store/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/features/auth/authSlice";
import { extractApiError } from "../../utils/extractApiError";

const AUTO_LOGIN_AFTER_REGISTER =
  import.meta.env.VITE_AUTO_LOGIN_AFTER_REGISTER === "true";
const ENABLE_EMAIL_VERIFICATION =
  import.meta.env.VITE_ENABLE_EMAIL_VERIFICATION === "true";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>("");
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Send data to backend for registration (modify the API as needed)
      const response = await register({ name, email, password }).unwrap();

      console.log("response", response);

      if (response.success) {
        console.log(
          "authLogin",
          AUTO_LOGIN_AFTER_REGISTER,
          ENABLE_EMAIL_VERIFICATION
        );
        setSuccess(response.message);
        if (AUTO_LOGIN_AFTER_REGISTER) {
          setTimeout(() => {
            dispatch(
              setCredentials({ user: response.data, token: response.token })
            );
            navigate("/"); // Modify this as needed
          }, 2000);
        } else if (ENABLE_EMAIL_VERIFICATION) {
        } else {
          console.log("here");
          setTimeout(() => {
            navigate("/auth/login");
          }, 2000); // 2 seconds
        }
      } else if (!response.success) {
        setError(response.message);
      }
    } catch (err: any) {
      const { message, statusCode } = extractApiError(err);
      console.error(`Error ${statusCode}: ${message}`);
      setError(message || "An error occurred while registering.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div>{error}</div>}
      {success && <div>{success}</div>}
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          minLength={3}
          maxLength={15}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          minLength={8}
          maxLength={15}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={isLoading || Boolean(success)}>
        {success ? "Redirecting..." : isLoading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default Register;
