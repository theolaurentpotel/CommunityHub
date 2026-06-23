import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { createEvent, fetchCategories, selectEvents, selectCategories, clearCreateStatus } from '../features/events/eventsSlice';
import { selectCanCreateEvent, selectIsAdmin } from '../features/auth/authSlice';

export default function CreateEventPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createStatus, error } = useSelector(selectEvents);
  const categories = useSelector(selectCategories);
  const canCreate = useSelector(selectCanCreateEvent);
  const isAdmin = useSelector(selectIsAdmin);

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: { event_type: 'presentiel', price_type: 'gratuit' },
  });

  const priceType = useWatch({ control, name: 'price_type' });
  const startDate = useWatch({ control, name: 'start_date' });

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(clearCreateStatus());
  }, [dispatch]);

  useEffect(() => {
    if (createStatus === 'succeeded') {
      navigate('/events');
    }
  }, [createStatus, navigate]);

  if (!canCreate) {
    return (
      <Alert variant="warning">
        Seuls les organisateurs et administrateurs peuvent créer un événement.
      </Alert>
    );
  }

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      event_category_id: Number(values.event_category_id),
      max_participants: Number(values.max_participants),
      price: values.price_type === 'payant' ? Number(values.price) : 0,
    };
    dispatch(createEvent(payload));
  };

  return (
    <Row className="justify-content-center">
      <Col lg={8}>
        <h1 className="h3 mb-4">Créer un événement</h1>
        <Card className="ch-card">
          <Card.Body className="p-4">
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Row className="g-3">
                <Col md={8}>
                  <Form.Label>Nom de l'événement *</Form.Label>
                  <Form.Control
                    isInvalid={!!errors.name}
                    {...register('name', { required: 'Champ obligatoire' })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                </Col>

                <Col md={4}>
                  <Form.Label>Catégorie *</Form.Label>
                  <Form.Select
                    isInvalid={!!errors.event_category_id}
                    {...register('event_category_id', { required: 'Champ obligatoire' })}
                  >
                    <option value="">— choisir —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.event_category_id?.message}</Form.Control.Feedback>
                  {isAdmin && (
                    <Form.Text>
                      <Link to="/admin/categories">Gérer les catégories</Link>
                    </Form.Text>
                  )}
                </Col>

                <Col md={6}>
                  <Form.Label>Type *</Form.Label>
                  <div className="d-flex gap-3 pt-1">
                    {['presentiel', 'distanciel'].map((t) => (
                      <Form.Check
                        key={t}
                        type="radio"
                        id={`type-${t}`}
                        label={t.charAt(0).toUpperCase() + t.slice(1)}
                        value={t}
                        {...register('event_type')}
                      />
                    ))}
                  </div>
                </Col>

                <Col md={6}>
                  <Form.Label>Tarification *</Form.Label>
                  <div className="d-flex gap-3 pt-1">
                    {['gratuit', 'payant'].map((p) => (
                      <Form.Check
                        key={p}
                        type="radio"
                        id={`price-${p}`}
                        label={p.charAt(0).toUpperCase() + p.slice(1)}
                        value={p}
                        {...register('price_type')}
                      />
                    ))}
                  </div>
                </Col>

                {priceType === 'payant' && (
                  <Col md={6}>
                    <Form.Label>Prix (€) *</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      step="0.01"
                      isInvalid={!!errors.price}
                      {...register('price', { required: 'Champ obligatoire', min: { value: 0.01, message: 'Prix invalide' } })}
                    />
                    <Form.Control.Feedback type="invalid">{errors.price?.message}</Form.Control.Feedback>
                  </Col>
                )}

                <Col md={priceType === 'payant' ? 6 : 12}>
                  <Form.Label>Participants maximum *</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    isInvalid={!!errors.max_participants}
                    {...register('max_participants', { required: 'Champ obligatoire', min: { value: 1, message: 'Au moins 1' } })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.max_participants?.message}</Form.Control.Feedback>
                </Col>

                <Col md={6}>
                  <Form.Label>Date de début *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    isInvalid={!!errors.start_date}
                    {...register('start_date', { required: 'Champ obligatoire' })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.start_date?.message}</Form.Control.Feedback>
                </Col>

                <Col md={6}>
                  <Form.Label>Date de fin *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    isInvalid={!!errors.end_date}
                    {...register('end_date', {
                      required: 'Champ obligatoire',
                      validate: (val) => {
                        if (!startDate || !val) return true;
                        const start = new Date(startDate);
                        const end = new Date(val);
                        if (
                          start.getFullYear() === end.getFullYear() &&
                          start.getMonth() === end.getMonth() &&
                          start.getDate() === end.getDate()
                        ) {
                          return 'La date de fin doit être un jour différent de la date de début';
                        }
                        if (end <= start) return 'La date de fin doit être après la date de début';
                        return true;
                      },
                    })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.end_date?.message}</Form.Control.Feedback>
                </Col>

                <Col md={12}>
                  <Form.Label>Image (URL, optionnel)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="https://..."
                    {...register('image')}
                  />
                </Col>

                <Col md={12}>
                  <Form.Label>Introduction / présentation *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    isInvalid={!!errors.introduction}
                    placeholder="Décris ton événement…"
                    {...register('introduction', { required: 'Champ obligatoire' })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.introduction?.message}</Form.Control.Feedback>
                </Col>
              </Row>

              <div className="d-flex gap-2 mt-4">
                <Button type="submit" variant="primary" disabled={createStatus === 'loading'}>
                  {createStatus === 'loading' ? 'Création…' : "Créer l'événement"}
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate('/events')}>
                  Annuler
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
