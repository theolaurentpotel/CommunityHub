import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import PremiumRoute from './routes/PremiumRoute';
import OrganizerRoute from './routes/OrganizerRoute';
import AdminRoute from './routes/AdminRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import EditProfilePage from './pages/EditProfilePage';
import PremiumPage from './pages/PremiumPage';
import MySkillPage from './pages/MySkillPage';
import ContactsPage from './pages/ContactsPage';
import MessagesPage from './pages/MessagesPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import CreateEventPage from './pages/CreateEventPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Routes publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Routes privées */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/premium" element={<PremiumPage />} />

          {/* Événements : listing & détail accessibles à tous les connectés */}
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />

          {/* Création d'événement : organisateur ou admin seulement */}
          <Route element={<OrganizerRoute />}>
            <Route path="/events/create" element={<CreateEventPage />} />
          </Route>

          {/* Administration : catégories (admin uniquement) */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          </Route>

          {/* Routes premium */}
          <Route element={<PremiumRoute />}>
            <Route path="/skills" element={<MySkillPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
