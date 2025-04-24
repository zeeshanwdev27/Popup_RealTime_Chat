import VisitorList from './VisitorList';
import ChatWindow from './ChatWindow';
import './dashboard.css';
import { useState, useEffect } from 'react';
import socket from '../../sockets/socket';

export default function DashboardPage() {
  const [visitors, setVisitors] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  useEffect(() => {
    socket.on('visitor_message', (visitor) => {
      setVisitors((prev) => {
        const exists = prev.find((v) => v.id === visitor.id);
        if (exists) {
          return prev.map((v) =>
            v.id === visitor.id
              ? {
                  ...v,
                  lastMessage: visitor.message, // ✅ always keep updated
                  messages: [...(v.messages || []), { text: visitor.message, type: 'incoming' }],
                }
              : v
          );
        }

        // ✅ When new visitor first arrives — set lastMessage too
        return [
          ...prev,
          {
            ...visitor,
            joined: false,
            lastMessage: visitor.message, // ✅ Show this on list immediately
            messages: [{ text: visitor.message, type: 'incoming' }],
          },
        ];
      });
    });

    return () => socket.off('visitor_message');
  }, []);

  const handleSelect = (visitor) => {
    setSelectedVisitor(visitor);
    socket.emit('join_room', visitor.id);
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === visitor.id ? { ...v, joined: true } : v
      )
    );
  };

  const handleSendMessage = (text) => {
    if (selectedVisitor) {
      socket.emit('agent_message', {
        to: selectedVisitor.id,
        message: text,
      });

      setVisitors((prev) =>
        prev.map((v) =>
          v.id === selectedVisitor.id
            ? {
                ...v,
                messages: [...(v.messages || []), { text, type: 'outgoing' }],
              }
            : v
        )
      );
    }
  };

  return (
    <div className="dashboard-container">
      <VisitorList
        visitors={visitors}
        onSelect={handleSelect}
        selectedVisitor={selectedVisitor}
      />
      <ChatWindow
        visitor={visitors.find((v) => v.id === selectedVisitor?.id)}
        onSend={handleSendMessage}
      />
    </div>
  );
}
