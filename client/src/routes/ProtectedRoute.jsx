/**
 * @copyright 2025 Mihai Elisei
 * @license Apache-2.0
 */

import Spinner from "@/components/ui/Spinner";
import useAuthentication from "@/lib/hooks/useAuthentication";

import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthorized, loading } = useAuthentication();

  if (loading) {
    return <Spinner />;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
