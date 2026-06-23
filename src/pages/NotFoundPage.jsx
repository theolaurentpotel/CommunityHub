import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default function NotFoundPage() {
  return (
    <div className="text-center py-5">
      <h1 className="display-1 fw-bold">404</h1>
      <p className="lead">Cette page n'existe pas.</p>
      <Button as={Link} to="/" variant="primary">Retour à l'accueil</Button>
    </div>
  );
}
