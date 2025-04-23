// pages/Dashboard/VisitorList.jsx
import './dashboard.css';

export default function VisitorList({ visitors, onSelect, selectedVisitor }) {
  return (
    <div className="visitor-list">
      <h2>Visitors</h2>
      {visitors.length === 0 && <p>No active visitors yet.</p>}
      {visitors.map((visitor) => (
        <div
          key={visitor.id}
          className={`visitor-item ${selectedVisitor?.id === visitor.id ? 'selected' : ''}`}
        >
          <div onClick={() => onSelect(visitor)}>
            <strong>{visitor.name || `Visitor ${visitor.id}`}</strong>
            <p>{visitor.lastMessage}</p>
          </div>
          {!visitor.joined && (
            <button onClick={() => onSelect({ ...visitor, joined: true })}>
              Join Chat
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
