import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';

// Formulaire de contact "général" (nous contacter).
// L'API ne fournit pas encore d'endpoint dédié : on simule l'envoi.
export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = () => {
    setSent(true);
    reset();
  };

  return (
    <Row className="justify-content-center">
      <Col md={8} lg={7}>
        <Card className="ch-card">
          <Card.Body className="p-4">
            <h1 className="h4 mb-4">Nous contacter</h1>

            {sent && <Alert variant="success">Message envoyé. Nous te répondrons rapidement.</Alert>}

            <Form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Form.Group className="mb-3">
                <Form.Label>Nom &amp; prénom *</Form.Label>
                <Form.Control
                  isInvalid={!!errors.fullname}
                  {...register('fullname', { required: 'Champ obligatoire' })}
                />
                <Form.Control.Feedback type="invalid">{errors.fullname?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Sujet *</Form.Label>
                <Form.Control
                  isInvalid={!!errors.subject}
                  {...register('subject', { required: 'Champ obligatoire' })}
                />
                <Form.Control.Feedback type="invalid">{errors.subject?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Message *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  isInvalid={!!errors.message}
                  {...register('message', { required: 'Champ obligatoire' })}
                />
                <Form.Control.Feedback type="invalid">{errors.message?.message}</Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" variant="primary">Envoyer</Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
