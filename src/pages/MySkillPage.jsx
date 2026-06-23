import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { fetchSkills, createSkill, selectSkills } from '../features/skills/skillsSlice';
import { selectAuth } from '../features/auth/authSlice';
import SkillCard from '../components/skills/SkillCard';

export default function MySkillPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(selectSkills);
  const { user } = useSelector(selectAuth);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  const onSubmit = async (values) => {
    const result = await dispatch(createSkill(values));
    if (createSkill.fulfilled.match(result)) {
      reset();
      dispatch(fetchSkills());
    }
  };

  // Si l'API renvoie l'id du propriétaire, on isole "mes" compétences.
  const mySkills = user
    ? items.filter((s) => s.user_id === user.id || s.user_id === user.user_id)
    : items;
  const displayed = mySkills.length ? mySkills : items;

  return (
    <>
      <h1 className="h3 mb-4">Mes compétences</h1>
      <Row className="g-4">
        <Col lg={5}>
          <Card className="ch-card">
            <Card.Body>
              <Card.Title className="h5 mb-3">Ajouter une compétence</Card.Title>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Form.Group className="mb-3">
                  <Form.Label>Titre *</Form.Label>
                  <Form.Control
                    isInvalid={!!errors.title}
                    {...register('title', { required: 'Champ obligatoire' })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    isInvalid={!!errors.description}
                    {...register('description', { required: 'Champ obligatoire' })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Prix journalier (€) *</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="1"
                    isInvalid={!!errors.daily_price}
                    {...register('daily_price', { required: 'Champ obligatoire', min: { value: 0, message: 'Prix invalide' } })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.daily_price?.message}</Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" variant="primary" disabled={status === 'loading'}>
                  Ajouter
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <h2 className="h5 mb-3">Liste des compétences</h2>
          {status === 'loading' && <p className="text-muted">Chargement…</p>}
          {displayed.length === 0 && status !== 'loading' && (
            <Alert variant="light">Aucune compétence pour le moment.</Alert>
          )}
          <Row className="g-3">
            {displayed.map((skill, i) => (
              <Col sm={6} key={skill.id ?? i}>
                <SkillCard skill={skill} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </>
  );
}
