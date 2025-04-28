import { FC } from "react";
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
  const handleGoogleLogin = () => {
    window.location.href = getGoogleAuthUrl();
  };

  return (
    <Button type="button" variant="outline" onClick={handleGoogleLogin}>
      <FontAwesomeIcon icon={faGoogle} className="mr-2" />
      {text}
    </Button>
  );
};

export default GoogleButton;
