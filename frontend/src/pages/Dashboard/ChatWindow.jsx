import { useState } from "react";
import MessageBubble from "./MessageBubble";
import { FiSend } from "react-icons/fi";

export default function ChatWindow({ visitor, onSend }) {
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
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

          <form className="chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={!visitor.joined}
            />
            <button onClick={sendMessage} disabled={!visitor.joined}>
            <FiSend size={20} />
            </button>
          </form>

        </>
      ) : (
        <div className="no-chat">Select a visitor to start chat</div>
      )}
    </div>
  );
}
