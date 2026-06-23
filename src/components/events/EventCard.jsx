import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function EventCard({ event }) {
  const isPast = event.end_date && new Date(event.end_date) < new Date();

  return (
    <Card className="ch-card ch-event-card h-100">
      {event.image && (
        <Card.Img
          variant="top"
          src={event.image}
          alt={event.name}
          style={{ height: 160, objectFit: 'cover' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      <Card.Body className="d-flex flex-column">
        <div className="d-flex flex-wrap gap-1 mb-2">
          <Badge bg={event.event_type === 'distanciel' ? 'info' : 'primary'} text="white">
            {event.event_type === 'distanciel' ? 'Distanciel' : 'Présentiel'}
          </Badge>
          <Badge bg={event.price_type === 'gratuit' ? 'success' : 'warning'} text={event.price_type === 'payant' ? 'dark' : 'white'}>
            {event.price_type === 'gratuit' ? 'Gratuit' : `${event.price} €`}
          </Badge>
          {isPast && <Badge bg="secondary">Terminé</Badge>}
        </div>
        <Card.Title className="h6 mb-1">{event.name}</Card.Title>
        {event.category_name && (
          <small className="text-muted mb-2">{event.category_name}</small>
        )}
        <Card.Text className="small text-muted mb-2" style={{ flexGrow: 1 }}>
          {event.introduction?.slice(0, 100)}{event.introduction?.length > 100 ? '…' : ''}
        </Card.Text>
        {event.start_date && (
          <small className="text-muted d-block mb-3">
            📅 {new Date(event.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </small>
        )}
        <Link to={`/events/${event.id}`} className="btn btn-outline-primary btn-sm mt-auto">
          Voir l'événement
        </Link>
      </Card.Body>
    </Card>
  );
}
