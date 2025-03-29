import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Layout from "./Layout";
import Spinner from "./Spinner";

const ProtectedRoute = () => {
  const { data, isLoading } = useAuth();
  // @ts-ignore - We know response has a user property

  const user = data?.user;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{ redirectUrl: window.location.pathname }}
      />
    );
  }

  return <Layout />;
};

export default ProtectedRoute;
