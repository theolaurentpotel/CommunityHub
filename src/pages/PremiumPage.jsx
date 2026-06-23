import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Alert, Form, ListGroup } from 'react-bootstrap';
import { goPremium, selectPayments } from '../features/payments/paymentsSlice';
import { fetchMe, selectIsPremium, selectHasPremiumAccess } from '../features/auth/authSlice';

// Paiement Stripe simulé : on envoie juste la demande à l'API.
export default function PremiumPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector(selectPayments);
  const isPremium = useSelector(selectIsPremium);
  const hasPremiumAccess = useSelector(selectHasPremiumAccess);
  const [method, setMethod] = useState('stripe');
  const [done, setDone] = useState(false);

  const handlePay = async () => {
    const result = await dispatch(goPremium({ payment_method: method, amount: 19.99 }));
    if (goPremium.fulfilled.match(result)) {
      setDone(true);
      await dispatch(fetchMe()); // rafraîchit le statut premium
    }
  };

  if (hasPremiumAccess && !done) {
    return (
      <Row className="justify-content-center">
        <Col md={7}>
          <Alert variant="success">
            Tu es déjà membre premium. Profite des compétences, contacts et messages !
          </Alert>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            Retour au tableau de bord
          </Button>
        </Col>
      </Row>
    );
  }

  return (
    <Row className="justify-content-center">
      <Col md={7} lg={6}>
        <Card className="ch-card">
          <Card.Body className="p-4">
            <h1 className="h4 mb-1">Passer premium</h1>
            <p className="text-muted">Débloque l'accès complet à CommunityHub.</p>

            <ListGroup variant="flush" className="mb-3">
              <ListGroup.Item>Proposer tes compétences</ListGroup.Item>
              <ListGroup.Item>Gérer tes contacts</ListGroup.Item>
              <ListGroup.Item>Envoyer des messages privés</ListGroup.Item>
              <ListGroup.Item>Créer des événements premium</ListGroup.Item>
            </ListGroup>

            <div className="d-flex align-items-baseline mb-3">
              <span className="display-6 fw-bold me-2">19,99 €</span>
              <span className="text-muted">paiement unique (simulé)</span>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {done && <Alert variant="success">Paiement validé, tu es maintenant premium !</Alert>}

            <Form.Group className="mb-3">
              <Form.Label>Moyen de paiement</Form.Label>
              <Form.Select value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="stripe">Carte (Stripe)</option>
                <option value="cheque">Chèque</option>
              </Form.Select>
            </Form.Group>

            {done ? (
              <Button variant="primary" className="w-100" onClick={() => navigate('/dashboard')}>
                Aller au tableau de bord
              </Button>
            ) : (
              <Button
                variant="primary"
                className="w-100"
                onClick={handlePay}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Paiement…' : 'Payer et devenir premium'}
              </Button>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
