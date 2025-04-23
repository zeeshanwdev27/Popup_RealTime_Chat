import { useEffect, useState } from 'react';
import socket from '../../sockets/socket';
import './chatPopup.css';
import { FiX, FiSend } from 'react-icons/fi';

export default function ChatBox({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [visitorId, setVisitorId] = useState(null);

  useEffect(() => {
    const handleConnect = () => {
      const id = socket.id;
      setVisitorId(id);
  
      const handleMessage = (msg) => {
        if (msg.from === 'visitor' || msg.from === undefined) return;
        setMessages((prev) => [...prev, { ...msg, type: 'incoming' }]);
      };
  
      socket.on(`chat:${id}`, handleMessage);
  
      // Cleanup
      return () => {
        socket.off(`chat:${id}`, handleMessage);
      };
    };
  
    if (socket.connected) {
      return handleConnect(); // Call and return cleanup
    } else {
      socket.on('connect', handleConnect);
      return () => {
        socket.off('connect', handleConnect);
      };
    }
  }, []);
  

  const sendMessage = () => {
    if (text.trim()) {
      const messageData = {
        id: visitorId,
        message: text,
      };

      // Send visitor message to backend
      socket.emit('visitor_message', {
        id: visitorId,
        message: text,
        from: 'visitor', 
      });

      // Show in local state
      setMessages((prev) => [...prev, { message: text, type: 'outgoing' }]);
      setText('');
    }
  };

  return (
    <div className="chatbox">
      <div className="chat-header">
        <span>Chat Support</span>
        <button onClick={onClose}><FiX size={20} /></button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.type}`}>
            {msg.message}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}><FiSend size={18} /></button>
      </div>
    </div>
  );
}
