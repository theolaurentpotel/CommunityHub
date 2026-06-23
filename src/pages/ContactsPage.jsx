import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Row, Col, Button, Form, Alert, Badge, InputGroup } from 'react-bootstrap';
import {
  fetchContacts, sendContactRequest, acceptContact, selectContacts,
} from '../features/contacts/contactsSlice';
import { sendMessage } from '../features/messages/messagesSlice';

export default function ContactsPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(selectContacts);

  const [receiverId, setReceiverId] = useState('');
  const [openMessageFor, setOpenMessageFor] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const handleAddContact = async () => {
    if (!receiverId) return;
    await dispatch(sendContactRequest({ receiver_id: receiverId }));
    setReceiverId('');
    setFeedback('Demande de contact envoyée.');
  };

  const handleSendMessage = async (contact) => {
    const receiver = contact.user_id || contact.receiver_id || contact.id;
    const result = await dispatch(sendMessage({ receiver_id: receiver, message: messageText }));
    if (sendMessage.fulfilled.match(result)) {
      setMessageText('');
      setOpenMessageFor(null);
      setFeedback('Message envoyé.');
    }
  };

  const isAccepted = (c) =>
    c.status === 'accepted' || c.accepted === true || c.is_accepted === 1;
  const isPending = (c) =>
    c.status === 'pending' || c.accepted === false || c.is_accepted === 0;

  return (
    <>
      <h1 className="h3 mb-4">Mes contacts</h1>

      <Card className="ch-card mb-4">
        <Card.Body>
          <Card.Title className="h6">Ajouter un contact</Card.Title>
          <p className="text-muted small mb-2">
            Saisis l'identifiant (id) de l'utilisateur à ajouter. Il devra accepter ta demande.
          </p>
          <InputGroup style={{ maxWidth: 360 }}>
            <Form.Control
              type="number"
              placeholder="id utilisateur"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
            />
            <Button variant="primary" onClick={handleAddContact}>Envoyer la demande</Button>
          </InputGroup>
        </Card.Body>
      </Card>

      {feedback && <Alert variant="success" onClose={() => setFeedback(null)} dismissible>{feedback}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {status === 'loading' && <p className="text-muted">Chargement…</p>}
      {items.length === 0 && status !== 'loading' && (
        <Alert variant="light">Tu n'as pas encore de contact.</Alert>
      )}

      <Row className="g-3">
        {items.map((c, i) => (
          <Col md={6} key={c.id ?? i}>
            <Card className="ch-card h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <strong>
                    {c.pseudo || c.firstname || c.name || `Utilisateur #${c.user_id || c.id}`}
                  </strong>
                  {isAccepted(c) && <Badge bg="success">Accepté</Badge>}
                  {isPending(c) && <Badge bg="warning" text="dark">En attente</Badge>}
                </div>

                {/* Accepter une demande reçue */}
                {isPending(c) && (
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => dispatch(acceptContact({ contact_id: c.id }))}
                  >
                    Accepter
                  </Button>
                )}

                {/* Envoyer un message (contacts acceptés uniquement) */}
                {isAccepted(c) && (
                  <>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => setOpenMessageFor(openMessageFor === c.id ? null : c.id)}
                    >
                      {openMessageFor === c.id ? 'Fermer' : 'Envoyer un message'}
                    </Button>

                    {openMessageFor === c.id && (
                      <Form
                        className="mt-3"
                        onSubmit={(e) => { e.preventDefault(); handleSendMessage(c); }}
                      >
                        <Form.Control
                          as="textarea"
                          rows={2}
                          className="mb-2"
                          placeholder="Ton message…"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          required
                        />
                        <Button size="sm" type="submit" variant="primary">Envoyer</Button>
                      </Form>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
