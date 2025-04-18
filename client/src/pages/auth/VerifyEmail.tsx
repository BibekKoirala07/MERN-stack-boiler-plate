import { useSearchParams } from "react-router-dom";
import { useVerifyEmailQuery } from "../../store/features/auth/authApi";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const { data, error, isLoading, isSuccess, isError } = useVerifyEmailQuery(
    { email: email || "", token: token || "" },
    {
      skip: !email || !token, // skip if either is missing
    }
  );

  if (!email || !token) {
    return <div>Missing email or token in the URL.</div>;
  }

  return (
    <div>
      {isLoading && <p>Verifying your email...</p>}
      {isSuccess && (
        <div style={{ color: "green" }}>
          ✅ {data?.message || "Your email has been successfully verified!"}
        </div>
      )}
      {isError && (
        <div style={{ color: "red" }}>
          ❌ {error?.data?.message || "Verification failed. Please try again."}
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
