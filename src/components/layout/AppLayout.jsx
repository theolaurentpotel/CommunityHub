import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import MainNavbar from './MainNavbar';

// Mise en page commune : barre de navigation + zone de contenu.
export default function AppLayout() {
  return (
    <div className="ch-app">
      <MainNavbar />
      <main className="py-4">
        <Container>
          <Outlet />
        </Container>
      </main>
      <footer className="ch-footer text-center py-4">
        <small>CommunityHub — {new Date().getFullYear()} · Le tableau d'affichage de ta communauté</small>
      </footer>
    </div>
  );
}
