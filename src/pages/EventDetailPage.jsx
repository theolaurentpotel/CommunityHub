import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Badge, Button, Alert, Spinner, Form, ListGroup, Row, Col } from 'react-bootstrap';
import {
  fetchEvent, registerToEvent, addEventMessage, requestMessageModeration,
  selectCurrentEvent, clearCurrent,
} from '../features/events/eventsSlice';
import { selectAuth, selectHasPremiumAccess, selectIsAdmin } from '../features/auth/authSlice';

export default function EventDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const event = useSelector(selectCurrentEvent);
  const { user } = useSelector(selectAuth);
  const hasPremiumAccess = useSelector(selectHasPremiumAccess);
  const isAdmin = useSelector(selectIsAdmin);

  const [regLoading, setRegLoading] = useState(false);
  const [regDone, setRegDone] = useState(false);
  const [regError, setRegError] = useState(null);
  const [msgText, setMsgText] = useState('');
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgError, setMsgError] = useState(null);

  useEffect(() => {
    dispatch(fetchEvent(id));
    return () => { dispatch(clearCurrent()); };
  }, [dispatch, id]);

  if (!event) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-2 text-muted">Chargement de l'événement…</p>
      </div>
    );
  }

  const isOrganizer = user && (String(event.user_id) === String(user.id) || String(event.organizer_id) === String(user.id));
  const isPast = event.end_date && new Date(event.end_date) < new Date();
  const isFull = event.max_participants && event.participants_count >= event.max_participants;

  const messages = Array.isArray(event.messages) ? event.messages : [];

  const handleRegister = async () => {
    setRegLoading(true); setRegError(null);
    const res = await dispatch(registerToEvent({ event_id: event.id, payment_method: 'stripe' }));
    setRegLoading(false);
    if (registerToEvent.fulfilled.match(res)) {
      setRegDone(true);
      dispatch(fetchEvent(id));
    } else {
      setRegError(res.payload || 'Erreur lors de l\'inscription');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    setMsgLoading(true); setMsgError(null);
    const res = await dispatch(addEventMessage({ event_id: event.id, message: msgText }));
    setMsgLoading(false);
    if (addEventMessage.fulfilled.match(res)) {
      setMsgText('');
    } else {
      setMsgError(res.payload || 'Erreur lors de l\'envoi');
    }
  };

  const handleModerate = (messageId) => {
    dispatch(requestMessageModeration({ message_id: messageId, event_id: event.id }));
  };

  return (
    <>
      <Button variant="link" className="ps-0 mb-3" onClick={() => navigate('/events')}>
        ← Retour aux événements
      </Button>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="ch-card mb-4">
            {event.image && (
              <Card.Img
                variant="top"
                src={event.image}
                alt={event.name}
                style={{ maxHeight: 320, objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <Card.Body className="p-4">
              <div className="d-flex flex-wrap gap-2 mb-3">
                <Badge bg={event.event_type === 'distanciel' ? 'info' : 'primary'}>
                  {event.event_type === 'distanciel' ? 'Distanciel' : 'Présentiel'}
                </Badge>
                <Badge bg={event.price_type === 'gratuit' ? 'success' : 'warning'} text={event.price_type === 'payant' ? 'dark' : 'white'}>
                  {event.price_type === 'gratuit' ? 'Gratuit' : `${event.price} €`}
                </Badge>
                {event.category_name && <Badge bg="secondary">{event.category_name}</Badge>}
                {isPast && <Badge bg="dark">Terminé</Badge>}
              </div>

              <h1 className="h3 mb-3">{event.name}</h1>
              <p className="text-muted">{event.introduction}</p>

              <hr />
              <Row className="g-2 small text-muted">
                {event.start_date && (
                  <Col sm={6}>
                    <strong>Début :</strong>{' '}
                    {new Date(event.start_date).toLocaleString('fr-FR')}
                  </Col>
                )}
                {event.end_date && (
                  <Col sm={6}>
                    <strong>Fin :</strong>{' '}
                    {new Date(event.end_date).toLocaleString('fr-FR')}
                  </Col>
                )}
                {event.max_participants && (
                  <Col sm={6}>
                    <strong>Places :</strong>{' '}
                    {event.participants_count ?? 0} / {event.max_participants}
                  </Col>
                )}
                {event.organizer_pseudo && (
                  <Col sm={6}>
                    <strong>Organisateur :</strong> {event.organizer_pseudo}
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>

          {/* Section messages */}
          <Card className="ch-card">
            <Card.Body className="p-4">
              <h2 className="h5 mb-3">Discussion</h2>

              {messages.length === 0 && (
                <p className="text-muted small">Aucun message pour le moment. Sois le premier à commenter !</p>
              )}

              <ListGroup variant="flush" className="mb-4">
                {messages
                  .filter((m) => !m.pending_deletion)
                  .map((m, i) => (
                    <ListGroup.Item key={m.id ?? i} className="px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong className="small">{m.user_pseudo || m.pseudo || 'Membre'}</strong>
                          {m.created_at && <small className="text-muted ms-2">{new Date(m.created_at).toLocaleString('fr-FR')}</small>}
                          <p className="mb-0 mt-1">{m.message || m.content}</p>
                        </div>
                        {isOrganizer && !m.pending_deletion && (
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleModerate(m.id)}
                          >
                            Modérer
                          </Button>
                        )}
                      </div>
                      {m.pending_deletion && (
                        <small className="text-warning">⏳ En attente de modération</small>
                      )}
                    </ListGroup.Item>
                  ))}
              </ListGroup>

              {user ? (
                <Form onSubmit={handleSendMessage}>
                  {msgError && <Alert variant="danger" className="py-2">{msgError}</Alert>}
                  <Form.Group className="mb-2">
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Laisse un commentaire…"
                      value={msgText}
                      onChange={(e) => setMsgText(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary" size="sm" disabled={msgLoading}>
                    {msgLoading ? 'Envoi…' : 'Envoyer'}
                  </Button>
                </Form>
              ) : (
                <Alert variant="light" className="mb-0">
                  <a href="/login">Connecte-toi</a> pour laisser un message.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Sidebar inscription */}
        <Col lg={4}>
          <Card className="ch-card sticky-top" style={{ top: 80 }}>
            <Card.Body className="p-4">
              <h2 className="h6 mb-3">Inscription</h2>

              {isPast ? (
                <Alert variant="secondary" className="mb-0">Cet événement est terminé.</Alert>
              ) : isFull ? (
                <Alert variant="warning" className="mb-0">
                  Complet — le nombre maximum de participants a été atteint.
                </Alert>
              ) : !user ? (
                <Alert variant="light">
                  <a href="/login">Connecte-toi</a> pour t'inscrire.
                </Alert>
              ) : !hasPremiumAccess ? (
                <Alert variant="info">
                  L'inscription aux événements est réservée aux membres <a href="/premium">premium</a>.
                </Alert>
              ) : regDone ? (
                <Alert variant="success" className="mb-0">Tu es inscrit(e) ! 🎉</Alert>
              ) : (
                <>
                  {regError && <Alert variant="danger" className="py-2">{regError}</Alert>}
                  {event.price_type === 'payant' && (
                    <p className="small text-muted mb-3">
                      Paiement sécurisé via Stripe — <strong>{event.price} €</strong>
                      <br />
                      <span className="text-muted" style={{ fontSize: '0.78em' }}>
                        (10 % de frais de service déduits pour l'organisateur)
                      </span>
                    </p>
                  )}
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={handleRegister}
                    disabled={regLoading}
                  >
                    {regLoading ? 'Inscription…' : event.price_type === 'payant' ? `Payer et s'inscrire (${event.price} €)` : "S'inscrire gratuitement"}
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
