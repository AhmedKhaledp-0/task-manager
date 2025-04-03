import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkGoogleAuthStatus } from "../lib/api";
import Spinner from "../components/Spinner";

const GoogleCallback = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyGoogleAuth = async () => {
      try {
        await checkGoogleAuthStatus();
        navigate("/", { replace: true });
      } catch (error: any) {
        setError(error.message || "Authentication failed");
        // Redirect to login page after a delay
        setTimeout(() => {
          navigate("/signin?googleAuth=failed", { replace: true });
        }, 3000);
      }
    };

    verifyGoogleAuth();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
        {error ? (
          <div>
            <h2 className="text-center text-2xl font-extrabold text-red-600">
              Authentication Failed
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {error}. Redirecting to login page...
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-center text-2xl font-extrabold text-gray-900">
              Completing Authentication
            </h2>
            <div className="mt-4 flex justify-center">
              <Spinner size="sm" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
