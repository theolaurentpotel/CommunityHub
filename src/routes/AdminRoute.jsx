import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectIsAdmin } from '../features/auth/authSlice';

// Réserve certaines routes aux administrateurs (ex : gestion des catégories).
export default function AdminRoute() {
  const isAdmin = useSelector(selectIsAdmin);
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
