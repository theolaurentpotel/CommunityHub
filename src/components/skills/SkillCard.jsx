import { Card, Badge } from 'react-bootstrap';

export default function SkillCard({ skill }) {
  return (
    <Card className="ch-card h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <Card.Title className="h6 mb-2">{skill.title}</Card.Title>
          {skill.daily_price != null && (
            <Badge bg="success">{skill.daily_price} € / jour</Badge>
          )}
        </div>
        <Card.Text className="text-muted small mb-0">{skill.description}</Card.Text>
      </Card.Body>
    </Card>
  );
}
