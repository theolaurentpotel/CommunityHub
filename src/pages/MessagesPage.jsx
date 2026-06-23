import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ButtonGroup, Button, ListGroup, Alert, Form } from 'react-bootstrap';
import { fetchMessages, selectMessages } from '../features/messages/messagesSlice';

export default function MessagesPage() {
  const dispatch = useDispatch();
  const { items, view, status, error } = useSelector(selectMessages);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchMessages('received'));
  }, [dispatch]);

  // Filtre texte côté client (sur l'expéditeur ou le contenu).
  const filtered = items.filter((m) => {
    const haystack = `${m.message || ''} ${m.sender_pseudo || ''} ${m.sender || ''}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  return (
    <>
      <h1 className="h3 mb-4">Mes messages</h1>

      <div className="d-flex flex-wrap gap-3 align-items-center mb-3">
        <ButtonGroup>
          <Button
            variant={view === 'received' ? 'primary' : 'outline-primary'}
            onClick={() => dispatch(fetchMessages('received'))}
          >
            Reçus
          </Button>
          <Button
            variant={view === 'sent' ? 'primary' : 'outline-primary'}
            onClick={() => dispatch(fetchMessages('sent'))}
          >
            Envoyés
          </Button>
        </ButtonGroup>

        <Form.Control
          style={{ maxWidth: 280 }}
          placeholder="Filtrer les messages…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {status === 'loading' && <p className="text-muted">Chargement…</p>}

      <Card className="ch-card">
        <ListGroup variant="flush">
          {filtered.length === 0 && status !== 'loading' && (
            <ListGroup.Item className="text-muted">Aucun message.</ListGroup.Item>
          )}
          {filtered.map((m, i) => (
            <ListGroup.Item key={m.id ?? i}>
              <div className="d-flex justify-content-between">
                <strong>
                  {view === 'sent'
                    ? `À : ${m.receiver_pseudo || m.receiver || '—'}`
                    : `De : ${m.sender_pseudo || m.sender || '—'}`}
                </strong>
                {m.created_at && <small className="text-muted">{m.created_at}</small>}
              </div>
              <div>{m.message}</div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </>
  );
}
