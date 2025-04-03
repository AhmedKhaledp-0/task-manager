import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";
import { useAppSelector } from "../store/store";
import { selectEffectiveTheme } from "../store/slices/themeSlice";
import { useEffect } from "react";

const Error = () => {
  const navigate = useNavigate();
  const effectiveTheme = useAppSelector(selectEffectiveTheme);

  useEffect(() => {
    // Apply theme class to document root
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(effectiveTheme);
  }, [effectiveTheme]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="bg-danger-100 dark:bg-danger-900/30 p-4 rounded-full">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="text-danger-600 dark:text-danger-400 text-4xl"
              />
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-bold text-gray-900 dark:text-white">
            Oops! Page Not Found
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => navigate("/")}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Error;
