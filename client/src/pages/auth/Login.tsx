// src/components/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../store/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/features/auth/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ email, password }).unwrap();
      dispatch(setCredentials({ user: response.data, token: response.token }));
      setTimeout(() => {
        navigate("/"); // change destination as needed
      }, 2000);
    } catch (err: any) {
      setError(err?.data?.message || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div>{error}</div>}
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
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default Login;
