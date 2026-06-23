import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Form, InputGroup, Button, Alert, Spinner } from 'react-bootstrap';
import { fetchEvents, fetchCategories, selectEvents, selectCategories } from '../features/events/eventsSlice';
import { selectCanCreateEvent } from '../features/auth/authSlice';
import EventCard from '../components/events/EventCard';

export default function EventsPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(selectEvents);
  const categories = useSelector(selectCategories);
  const canCreate = useSelector(selectCanCreateEvent);

  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [priceType, setPriceType] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleFilter = (e) => {
    e && e.preventDefault();
    dispatch(fetchEvents({
      q: q || undefined,
      type: type || undefined,
      price_type: priceType || undefined,
      category_id: categoryId || undefined,
    }));
  };

  const handleReset = () => {
    setQ(''); setType(''); setPriceType(''); setCategoryId('');
    dispatch(fetchEvents());
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="ch-eyebrow d-block mb-1">Ce qui se passe</span>
          <h1 className="h3 mb-0">Événements</h1>
        </div>
        {canCreate && (
          <Button as={Link} to="/events/create" variant="primary" size="sm">
            + Créer un événement
          </Button>
        )}
      </div>

      {/* Filtres */}
      <div className="ch-panel p-3 mb-4">
        <Row className="g-2 align-items-end">
          <Col md={4}>
            <Form.Label className="small fw-semibold mb-1">Recherche</Form.Label>
            <InputGroup size="sm">
              <Form.Control
                placeholder="Nom de l'événement…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
              />
            </InputGroup>
          </Col>
          <Col md={2}>
            <Form.Label className="small fw-semibold mb-1">Type</Form.Label>
            <Form.Select size="sm" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Tous</option>
              <option value="presentiel">Présentiel</option>
              <option value="distanciel">Distanciel</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Label className="small fw-semibold mb-1">Prix</Form.Label>
            <Form.Select size="sm" value={priceType} onChange={(e) => setPriceType(e.target.value)}>
              <option value="">Tous</option>
              <option value="gratuit">Gratuit</option>
              <option value="payant">Payant</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Label className="small fw-semibold mb-1">Catégorie</Form.Label>
            <Form.Select size="sm" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">Toutes</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={1} className="d-flex gap-1">
            <Button size="sm" variant="primary" onClick={handleFilter}>OK</Button>
            <Button size="sm" variant="outline-secondary" onClick={handleReset}>✕</Button>
          </Col>
        </Row>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {status === 'loading' && (
        <div className="text-center py-5">
          <Spinner animation="border" /><p className="mt-2 text-muted">Chargement…</p>
        </div>
      )}
      {items.length === 0 && status !== 'loading' && (
        <Alert variant="light">Aucun événement trouvé.</Alert>
      )}

      <Row className="g-4">
        {items.map((event) => (
          <Col sm={6} lg={4} key={event.id}>
            <EventCard event={event} />
          </Col>
        ))}
      </Row>
    </>
  );
}
