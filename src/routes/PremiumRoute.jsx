import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectHasPremiumAccess } from '../features/auth/authSlice';

// Réserve l'accès aux fonctionnalités premium.
// Les admins ont accès même sans abonnement premium.
export default function PremiumRoute() {
  const hasAccess = useSelector(selectHasPremiumAccess);
  if (!hasAccess) {
    return <Navigate to="/premium" replace />;
  }
  return <Outlet />;
}
