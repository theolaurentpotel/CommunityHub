import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { register as registerThunk, clearError, selectAuth } from '../features/auth/authSlice';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector(selectAuth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { user_status_id: 1, avatar: 'avatar.png' },
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (values) => {
    const result = await dispatch(registerThunk(values));
    if (registerThunk.fulfilled.match(result)) {
      // Inscription réussie -> redirection vers la connexion
      navigate('/login');
    }
  };

  return (
    <Row className="justify-content-center">
      <Col md={9} lg={8}>
        <Card className="ch-card">
          <Card.Body className="p-4">
            <h2 className="h4 mb-4">Inscription</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Label>Pseudo *</Form.Label>
                  <Form.Control
                    isInvalid={!!errors.pseudo}
                    {...register('pseudo', { required: 'Champ obligatoire' })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.pseudo?.message}</Form.Control.Feedback>
                </Col>
                <Col md={6}>
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    isInvalid={!!errors.email}
                    {...register('email', {
                      required: 'Champ obligatoire',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email invalide' },
                    })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                </Col>

                <Col md={6}>
                  <Form.Label>Mot de passe *</Form.Label>
                  <Form.Control
                    type="password"
                    isInvalid={!!errors.password}
                    {...register('password', {
                      required: 'Champ obligatoire',
                      minLength: { value: 6, message: '6 caractères minimum' },
                    })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                </Col>
                <Col md={6}>
                  <Form.Label>Avatar (nom de fichier)</Form.Label>
                  <Form.Control {...register('avatar')} placeholder="avatar.png" />
                </Col>

                <Col md={6}>
                  <Form.Label>Nom *</Form.Label>
                  <Form.Control
                    isInvalid={!!errors.lastname}
                    {...register('lastname', { required: 'Champ obligatoire' })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.lastname?.message}</Form.Control.Feedback>
                </Col>
                <Col md={6}>
                  <Form.Label>Prénom *</Form.Label>
                  <Form.Control
                    isInvalid={!!errors.firstname}
                    {...register('firstname', { required: 'Champ obligatoire' })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.firstname?.message}</Form.Control.Feedback>
                </Col>

                <Col md={6}>
                  <Form.Label>Date de naissance *</Form.Label>
                  <Form.Control
                    type="date"
                    isInvalid={!!errors.birthdate}
                    {...register('birthdate', { required: 'Champ obligatoire' })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.birthdate?.message}</Form.Control.Feedback>
                </Col>
                <Col md={6}>
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control {...register('phone')} placeholder="0600000000" />
                </Col>

                <Col md={12}>
                  <Form.Label>Adresse *</Form.Label>
                  <Form.Control
                    isInvalid={!!errors.address}
                    {...register('address', { required: 'Champ obligatoire' })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.address?.message}</Form.Control.Feedback>
                </Col>

                <Col md={4}>
                  <Form.Label>Code postal *</Form.Label>
                  <Form.Control
                    isInvalid={!!errors.postal_code}
                    {...register('postal_code', { required: 'Champ obligatoire' })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.postal_code?.message}</Form.Control.Feedback>
                </Col>
                <Col md={4}>
                  <Form.Label>Ville *</Form.Label>
                  <Form.Control
                    isInvalid={!!errors.city}
                    {...register('city', { required: 'Champ obligatoire' })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.city?.message}</Form.Control.Feedback>
                </Col>
                <Col md={4}>
                  <Form.Label>Statut *</Form.Label>
                  <Form.Select {...register('user_status_id')}>
                    <option value={1}>Membre</option>
                    <option value={2}>Organisateur</option>
                  </Form.Select>
                </Col>
              </Row>

              <Button type="submit" variant="primary" className="w-100 mt-4" disabled={status === 'loading'}>
                {status === 'loading' ? 'Création…' : "Créer mon compte"}
              </Button>
            </Form>

            <p className="text-center text-muted mt-3 mb-0">
              Déjà inscrit ? <Link to="/login">Connecte-toi</Link>
            </p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
