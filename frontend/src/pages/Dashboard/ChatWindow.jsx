import { useState } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ visitor, onSend }) {
  const [text, setText] = useState('');

  const sendMessage = () => {
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  return (
    <div className="chat-window">
      {visitor ? (
        <>
          <h2>Chat with {visitor.name || `Visitor ${visitor.id}`}</h2>
          <div className="chat-messages">
            {visitor.messages?.map((msg, index) => (
              <MessageBubble
                key={index}
                text={msg.text || msg.message}
                from={msg.type || msg.direction}
              />
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={!visitor.joined}
            />
            <button onClick={sendMessage} disabled={!visitor.joined}>Send</button>
          </div>
        </>
      ) : (
        <div className="no-chat">Select a visitor to view chat</div>
      )}
    </div>
  );
}
