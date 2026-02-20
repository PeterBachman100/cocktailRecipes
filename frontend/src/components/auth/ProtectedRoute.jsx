import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, isAdmin, loading } = useAuth();
  const browserContext = useOutletContext();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return <Outlet context={browserContext} />;
};

export default ProtectedRoute;