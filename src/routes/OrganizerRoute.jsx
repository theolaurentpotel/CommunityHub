import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectCanCreateEvent } from '../features/auth/authSlice';

// Réserve la création d'événements aux organisateurs et administrateurs.
export default function OrganizerRoute() {
  const canCreate = useSelector(selectCanCreateEvent);
  if (!canCreate) {
    return <Navigate to="/events" replace />;
  }
  return <Outlet />;
}
