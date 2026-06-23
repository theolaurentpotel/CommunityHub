import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Form, Button, Row, Col, Alert, ListGroup, Badge } from 'react-bootstrap';
import {
  fetchCategories, createCategory, selectCategories, selectEvents,
} from '../features/events/eventsSlice';

export default function AdminCategoriesPage() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const { categoryStatus, error } = useSelector(selectEvents);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const onSubmit = async (values) => {
    const res = await dispatch(createCategory({ name: values.name }));
    if (createCategory.fulfilled.match(res)) {
      reset();
    }
  };

  return (
    <>
      <h1 className="h3 mb-4">Catégories d'événements</h1>
      <p className="text-muted">
        Gère ici les catégories disponibles. Elles seront proposées lors de la création d'un événement.
      </p>

      <Row className="g-4">
        <Col lg={5}>
          <Card className="ch-card">
            <Card.Body>
              <Card.Title className="h5 mb-3">Ajouter une catégorie</Card.Title>
              {error && <Alert variant="danger">{error}</Alert>}
              {categoryStatus === 'succeeded' && (
                <Alert variant="success" className="py-2">Catégorie créée.</Alert>
              )}
              <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Form.Group className="mb-3">
                  <Form.Label>Nom de la catégorie *</Form.Label>
                  <Form.Control
                    placeholder="ex : jeu de société"
                    isInvalid={!!errors.name}
                    {...register('name', { required: 'Champ obligatoire' })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" variant="primary" disabled={categoryStatus === 'loading'}>
                  {categoryStatus === 'loading' ? 'Création…' : 'Ajouter'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <h2 className="h5 mb-3">Catégories existantes <Badge bg="secondary">{categories.length}</Badge></h2>
          {categories.length === 0 ? (
            <Alert variant="light">Aucune catégorie pour le moment.</Alert>
          ) : (
            <Card className="ch-card">
              <ListGroup variant="flush">
                {categories.map((c) => (
                  <ListGroup.Item key={c.id} className="d-flex justify-content-between align-items-center">
                    <span>{c.name}</span>
                    <Badge bg="light" text="dark">#{c.id}</Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          )}
        </Col>
      </Row>
    </>
  );
}
