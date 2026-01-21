// src/components/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * Props:
 * - children: JSX element to render if allowed
 * - allowedRoles: array of roles that can access this route
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in but role not allowed → redirect to tasks page
    return <Navigate to="/tasks" replace />;
  }

  return children;
};

export default ProtectedRoute;
