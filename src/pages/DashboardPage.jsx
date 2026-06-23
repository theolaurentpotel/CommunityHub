import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Badge, Spinner, Button, Alert, ListGroup, Tabs, Tab } from 'react-bootstrap';
import { fetchMe, selectAuth, selectIsPremium, selectHasPremiumAccess, selectIsAdmin, selectCanCreateEvent } from '../features/auth/authSlice';
import {
  fetchMyRegistrations, fetchMyEvents, rateOrganizer, requestPayout,
  selectMyRegistrations, selectMyEvents,
} from '../features/events/eventsSlice';

function EventListItem({ event, isPast, onRate }) {
  const [rated, setRated] = useState(false);
  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-center">
      <div>
        <strong>{event.name || event.event_name}</strong>
        {event.start_date && (
          <small className="text-muted d-block">
            {new Date(event.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </small>
        )}
      </div>
      <div className="d-flex gap-2 align-items-center">
        <Link to={`/events/${event.id || event.event_id}`} className="btn btn-outline-primary btn-sm">
          Voir
        </Link>
        {isPast && onRate && !rated && (
          <Button
            size="sm"
            variant="outline-warning"
            onClick={() => { onRate(event); setRated(true); }}
          >
            👍 J'aime
          </Button>
        )}
        {rated && <Badge bg="success">Noté !</Badge>}
      </div>
    </ListGroup.Item>
  );
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuth);
  const isPremium = useSelector(selectIsPremium);
  const hasPremiumAccess = useSelector(selectHasPremiumAccess);
  const isAdmin = useSelector(selectIsAdmin);
  const canCreate = useSelector(selectCanCreateEvent);
  const myRegistrations = useSelector(selectMyRegistrations);
  const myEvents = useSelector(selectMyEvents);
  const [payoutMsg, setPayoutMsg] = useState(null);

  useEffect(() => {
    if (!user) dispatch(fetchMe());
    dispatch(fetchMyRegistrations());
    dispatch(fetchMyEvents());
  }, [dispatch, user]);

  if (!user) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-2 text-muted">Chargement du profil…</p>
      </div>
    );
  }

  const now = new Date();
  const regCurrent = myRegistrations.filter((r) => !r.end_date || new Date(r.end_date) >= now);
  const regPast = myRegistrations.filter((r) => r.end_date && new Date(r.end_date) < now);
  const evtCurrent = myEvents.filter((e) => !e.end_date || new Date(e.end_date) >= now);
  const evtPast = myEvents.filter((e) => e.end_date && new Date(e.end_date) < now);

  const handleRate = (event) => {
    dispatch(rateOrganizer({ event_id: event.id || event.event_id }));
  };

  const handlePayout = async () => {
    const res = await dispatch(requestPayout());
    if (requestPayout.fulfilled.match(res)) {
      setPayoutMsg('Demande de versement envoyée !');
    } else {
      setPayoutMsg('Erreur lors de la demande de versement.');
    }
  };

  const premiumLinks = [
    { to: '/skills', title: 'Mes compétences', desc: 'Propose ton savoir-faire.' },
    { to: '/contacts', title: 'Mes contacts', desc: 'Ajoute des membres et discute.' },
    { to: '/messages', title: 'Mes messages', desc: 'Consulte tes messages privés.' },
    { to: '/events', title: 'Événements', desc: 'Participe ou organise des événements.' },
  ];

  return (
    <>
      <h1 className="h3 mb-4">Mon tableau de bord</h1>

      <Row className="g-4 mb-4">
        {/* Profil */}
        <Col md={6}>
          <Card className="ch-card h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <Card.Title className="mb-0">Mon profil</Card.Title>
                {isAdmin ? (
                  <Badge bg="danger">Admin</Badge>
                ) : isPremium ? (
                  <Badge bg="warning" text="dark">Premium</Badge>
                ) : (
                  <Badge bg="secondary">Membre</Badge>
                )}
              </div>
              <p className="mb-1"><strong>Pseudo :</strong> {user.pseudo}</p>
              <p className="mb-1"><strong>Nom :</strong> {user.firstname} {user.lastname}</p>
              <p className="mb-1"><strong>Email :</strong> {user.email}</p>
              <p className="mb-0"><strong>Ville :</strong> {user.city}</p>

              {/* Gains organisateur */}
              {(user.total_earnings != null || user.earnings != null) && (
                <div className="mt-3 p-3 bg-light rounded">
                  <strong>Gains générés :</strong>{' '}
                  <span className="text-success fw-bold">
                    {(user.total_earnings ?? user.earnings ?? 0).toFixed(2)} €
                  </span>
                  {user.stats && (
                    <div className="small text-muted mt-1">
                      {user.stats.events_count != null && <span>Événements : {user.stats.events_count}</span>}
                      {user.stats.participants_total != null && <span className="ms-3">Participants : {user.stats.participants_total}</span>}
                    </div>
                  )}
                  {payoutMsg && <Alert variant="info" className="mt-2 py-1 mb-0">{payoutMsg}</Alert>}
                  <Button size="sm" variant="outline-primary" className="mt-2" onClick={handlePayout}>
                    Demander le versement
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Abonnement */}
        <Col md={6}>
          <Card className="ch-card h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="mb-3">Abonnement</Card.Title>
              {isAdmin ? (
                <p className="text-success mb-0">Compte administrateur : accès complet à toutes les fonctionnalités.</p>
              ) : isPremium ? (
                <p className="text-success mb-0">Tu es premium : accès à toutes les fonctionnalités.</p>
              ) : (
                <>
                  <p className="text-muted">
                    Passe premium pour débloquer les compétences, contacts, messagerie et les événements.
                  </p>
                  <Button as={Link} to="/premium" variant="primary" className="mt-auto align-self-start">
                    Passer premium
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Inscriptions aux événements */}
      {hasPremiumAccess && myRegistrations.length > 0 && (
        <Card className="ch-card mb-4">
          <Card.Body>
            <h2 className="h5 mb-3">Mes inscriptions</h2>
            <Tabs defaultActiveKey="current" className="mb-3">
              <Tab eventKey="current" title={`En cours (${regCurrent.length})`}>
                {regCurrent.length === 0
                  ? <p className="text-muted small">Aucune inscription en cours.</p>
                  : <ListGroup variant="flush">{regCurrent.map((r, i) => (
                    <EventListItem key={r.id ?? i} event={r} isPast={false} />
                  ))}</ListGroup>}
              </Tab>
              <Tab eventKey="past" title={`Passées (${regPast.length})`}>
                {regPast.length === 0
                  ? <p className="text-muted small">Aucune inscription passée.</p>
                  : <ListGroup variant="flush">{regPast.map((r, i) => (
                    <EventListItem key={r.id ?? i} event={r} isPast={true} onRate={handleRate} />
                  ))}</ListGroup>}
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      )}

      {/* Mes événements (organisateur) */}
      {myEvents.length > 0 && (
        <Card className="ch-card mb-4">
          <Card.Body>
            <h2 className="h5 mb-3">Mes événements</h2>
            <Tabs defaultActiveKey="current" className="mb-3">
              <Tab eventKey="current" title={`En cours (${evtCurrent.length})`}>
                {evtCurrent.length === 0
                  ? <p className="text-muted small">Aucun événement en cours.</p>
                  : <ListGroup variant="flush">{evtCurrent.map((e, i) => (
                    <EventListItem key={e.id ?? i} event={e} isPast={false} />
                  ))}</ListGroup>}
              </Tab>
              <Tab eventKey="past" title={`Passés (${evtPast.length})`}>
                {evtPast.length === 0
                  ? <p className="text-muted small">Aucun événement passé.</p>
                  : <ListGroup variant="flush">{evtPast.map((e, i) => (
                    <EventListItem key={e.id ?? i} event={e} isPast={true} />
                  ))}</ListGroup>}
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      )}

      {/* Espace premium */}
      {hasPremiumAccess && (
        <>
          <h2 className="h5 mb-3">Espace premium</h2>
          <Row className="g-4">
            {premiumLinks.map((link) => (
              <Col md={3} sm={6} key={link.to}>
                <Card className="ch-card h-100">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="h6">{link.title}</Card.Title>
                    <Card.Text className="text-muted small">{link.desc}</Card.Text>
                    <Button as={Link} to={link.to} variant="outline-primary" size="sm" className="mt-auto align-self-start">
                      Ouvrir
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
}
