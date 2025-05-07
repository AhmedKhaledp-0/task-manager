import { FC, useState } from "react";
import { getGoogleAuthUrl } from "../../lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Button from "../UI/Button";

interface GoogleButtonProps {
  text?: string;
  className?: string;
}

const GoogleButton: FC<GoogleButtonProps> = ({
  text = "Sign in with Google",
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);

    const width = 500;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const popup = window.open(
      getGoogleAuthUrl(),
      "googleLoginPopup",
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=1`
    );

    const checkPopup = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(checkPopup);
        setIsLoading(false);
        window.location.reload();
      }
    }, 500);
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleLogin}
      disabled={isLoading}
    >
      <FontAwesomeIcon icon={faGoogle} className="mr-2" />
      {isLoading ? "Authenticating..." : text}
    </Button>
  );
};

export default GoogleButton;
