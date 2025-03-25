import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Layout from "./Layout";

const ProtectedRoute = () => {
  const { data, isLoading } = useAuth();
  // @ts-ignore - We know response has a user property

  const user = data?.user;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
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
