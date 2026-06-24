import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import {
  updateProfile, fetchMe, clearUpdateStatus, selectAuth,
} from '../features/auth/authSlice';

// Met une date ISO (ex "1990-05-12T00:00:00") au format attendu par <input type="date">.
function toDateInput(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

export default function EditProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, updateStatus, error } = useSelector(selectAuth);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Charger le profil si besoin, puis pré-remplir le formulaire.
  useEffect(() => {
    dispatch(clearUpdateStatus());
    if (!user) dispatch(fetchMe());
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      reset({
        pseudo: user.pseudo || '',
        email: user.email || '',
        avatar: user.avatar || '',
        lastname: user.lastname || '',
        firstname: user.firstname || '',
        birthdate: toDateInput(user.birthdate),
        address: user.address || '',
        postal_code: user.postal_code || '',
        city: user.city || '',
        phone: user.phone || '',
        password: '',
      });
    }
  }, [user, reset]);

  if (!user) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-2 text-muted">Chargement du profil…</p>
      </div>
    );
  }

  const onSubmit = async (values) => {
    const result = await dispatch(updateProfile(values));
    if (updateProfile.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <Row className="justify-content-center">
      <Col md={9} lg={8}>
        <span className="ch-eyebrow d-block mb-1">Mon compte</span>
        <h1 className="h3 mb-4">Modifier mon profil</h1>

        <Card className="ch-card">
          <Card.Body className="p-4">
            {error && <Alert variant="danger">{error}</Alert>}
            {updateStatus === 'succeeded' && (
              <Alert variant="success">Profil mis à jour.</Alert>
            )}

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
                  <Form.Label>Nouveau mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Laisser vide pour ne pas changer"
                    isInvalid={!!errors.password}
                    {...register('password', {
                      validate: (val) =>
                        !val || val.length >= 6 || '6 caractères minimum',
                    })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Renseigne ce champ uniquement si tu veux changer ton mot de passe.
                  </Form.Text>
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

                <Col md={6}>
                  <Form.Label>Code postal *</Form.Label>
                  <Form.Control
                    isInvalid={!!errors.postal_code}
                    {...register('postal_code', { required: 'Champ obligatoire' })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.postal_code?.message}</Form.Control.Feedback>
                </Col>
                <Col md={6}>
                  <Form.Label>Ville *</Form.Label>
                  <Form.Control
                    isInvalid={!!errors.city}
                    {...register('city', { required: 'Champ obligatoire' })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.city?.message}</Form.Control.Feedback>
                </Col>
              </Row>

              <div className="d-flex gap-2 mt-4">
                <Button type="submit" variant="primary" disabled={updateStatus === 'loading'}>
                  {updateStatus === 'loading' ? 'Enregistrement…' : 'Enregistrer les modifications'}
                </Button>
                <Button as={Link} to="/dashboard" variant="outline-secondary">
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
