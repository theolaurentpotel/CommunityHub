import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  logout, selectAuth, selectIsAuthenticated, selectHasPremiumAccess, selectCanCreateEvent, selectIsAdmin,
} from '../../features/auth/authSlice';

export default function MainNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const hasPremiumAccess = useSelector(selectHasPremiumAccess);
  const canCreate = useSelector(selectCanCreateEvent);
  const isAdmin = useSelector(selectIsAdmin);
  const { user } = useSelector(selectAuth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="ch-navbar" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          Community<span className="ch-brand-accent">Hub</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">Accueil</Nav.Link>
            {isAuthenticated && (
              <>
                <Nav.Link as={NavLink} to="/dashboard">Tableau de bord</Nav.Link>
                <Nav.Link as={NavLink} to="/events">Événements</Nav.Link>
              </>
            )}
            {isAdmin && (
              <Nav.Link as={NavLink} to="/admin/categories">Catégories</Nav.Link>
            )}
            {hasPremiumAccess && (
              <>
                <Nav.Link as={NavLink} to="/skills">Compétences</Nav.Link>
                <Nav.Link as={NavLink} to="/contacts">Contacts</Nav.Link>
                <Nav.Link as={NavLink} to="/messages">Messages</Nav.Link>
              </>
            )}
            <Nav.Link as={NavLink} to="/contact">Contact</Nav.Link>
          </Nav>
          <Nav className="align-items-lg-center gap-lg-2">
            {isAuthenticated ? (
              <>
                {canCreate && (
                  <Button as={Link} to="/events/create" size="sm" variant="outline-warning">
                    + Événement
                  </Button>
                )}
                <span className="navbar-text me-2">
                  Bonjour {user?.pseudo || user?.firstname || 'membre'}
                </span>
                <Button size="sm" variant="outline-light" onClick={handleLogout}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">Connexion</Nav.Link>
                <Button as={Link} to="/register" size="sm" variant="light">
                  Inscription
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
