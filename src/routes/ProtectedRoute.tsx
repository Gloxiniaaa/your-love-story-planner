import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem("access_token");

  if (!token) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth?mode=login&redirect=${redirectTo}`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

