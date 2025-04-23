// pages/Dashboard/MessageBubble.jsx
export default function MessageBubble({ text, from }) {
  return (
    <div className={`message-bubble ${from === 'outgoing' ? 'outgoing' : 'incoming'}`}>
      {text}
    </div>
  );
}