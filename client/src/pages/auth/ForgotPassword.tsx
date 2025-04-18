import { useState, useEffect } from "react";
import { useForgotPasswordRequestMutation } from "../../store/features/auth/authApi";

const COOLDOWN_SECONDS = 130;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [forgotPassword, { isLoading }] = useForgotPasswordRequestMutation();
  const [disableTimer, setDisableTimer] = useState<number>(0);

  // Start countdown when cooldown timer is set
  useEffect(() => {
    let interval: any;
    if (disableTimer > 0) {
      interval = setInterval(() => {
        setDisableTimer((prev) => {
          const next = prev - 1;
          if (next <= 0) clearInterval(interval);
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [disableTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const res = await forgotPassword({ email }).unwrap();
      setMessage(res.message || "Email sent successfully.");

      // Start cooldown timer (130 seconds)
      setDisableTimer(COOLDOWN_SECONDS);
    } catch (err: any) {
      setError(err?.data?.message || "Something went wrong.");
    }
  };

  const isButtonDisabled = isLoading || disableTimer > 0;

  return (
    <form onSubmit={handleSubmit}>
      {message && <div>{message}</div>}
      {error && <div>{error}</div>}
      <div>
        <label>Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button type="submit" disabled={isButtonDisabled}>
        {isLoading
          ? "Sending..."
          : disableTimer > 0
          ? `Try again in ${disableTimer}s`
          : "Send Reset Link"}
      </button>
    </form>
  );
};

export default ForgotPassword;
