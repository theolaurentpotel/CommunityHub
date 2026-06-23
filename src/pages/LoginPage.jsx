import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { login, fetchMe, clearError, selectAuth } from '../features/auth/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector(selectAuth);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (values) => {
    // L'API attend { login, password } (login = pseudo OU email)
    const result = await dispatch(login(values));
    if (login.fulfilled.match(result)) {
      await dispatch(fetchMe());
      navigate('/dashboard');
    }
  };

  return (
    <Row className="justify-content-center">
      <Col md={6} lg={5}>
        <Card className="ch-card">
          <Card.Body className="p-4">
            <h2 className="h4 mb-4">Connexion</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Form.Group className="mb-3">
                <Form.Label>Pseudo ou email</Form.Label>
                <Form.Control
                  type="text"
                  isInvalid={!!errors.login}
                  {...register('login', { required: 'Champ obligatoire' })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.login?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  isInvalid={!!errors.password}
                  {...register('password', { required: 'Champ obligatoire' })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100" disabled={status === 'loading'}>
                {status === 'loading' ? 'Connexion…' : 'Se connecter'}
              </Button>
            </Form>

            <p className="text-center text-muted mt-3 mb-0">
              Pas encore de compte ? <Link to="/register">Inscris-toi</Link>
            </p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
