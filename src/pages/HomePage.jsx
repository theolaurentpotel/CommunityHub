import { Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice';

export default function HomePage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <>
      <section className="ch-hero p-4 p-md-5 mb-5">
        <Row className="align-items-center g-4">
          <Col lg={8}>
            <span className="ch-eyebrow d-block mb-3" style={{ color: 'var(--ch-coral)' }}>
              Le tableau d'affichage de ta communauté
            </span>
            <h1 className="display-5 fw-bold mb-3">
              Trouve, organise et vis des événements près de chez toi avec{' '}
              <span className="ch-brand-accent">CommunityHub</span>
            </h1>
            <p className="lead mb-4">
              Des soirées jeux aux ateliers, réserve ta place en quelques clics ou
              lance ton propre événement. Échange tes compétences et garde le contact
              avec les membres.
            </p>
            {isAuthenticated ? (
              <div className="d-flex flex-wrap gap-2">
                <Button as={Link} to="/events" size="lg" variant="light">
                  Voir les événements
                </Button>
                <Button as={Link} to="/dashboard" size="lg" variant="outline-light">
                  Mon tableau de bord
                </Button>
              </div>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                <Button as={Link} to="/register" size="lg" variant="light">
                  Créer un compte
                </Button>
                <Button as={Link} to="/login" size="lg" variant="outline-light">
                  Se connecter
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </section>

      <span className="ch-eyebrow d-block mb-3">Ce que tu peux faire ici</span>
      <Row className="g-4">
        {[
          { t: 'Événements', d: 'Participe à des événements ou organise les tiens, en présentiel comme en distanciel.' },
          { t: 'Compétences', d: 'Mets en avant ton savoir-faire et fixe ton tarif journalier.' },
          { t: 'Réseau', d: 'Ajoute des contacts et discute en privé avec les autres membres.' },
        ].map((f) => (
          <Col md={4} key={f.t}>
            <Card className="h-100 ch-card">
              <Card.Body className="p-4">
                <Card.Title className="h5 mb-2">{f.t}</Card.Title>
                <Card.Text className="text-muted mb-0">{f.d}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
