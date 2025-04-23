import { useState } from 'react';
import ChatBox from './ChatBox';
import './chatPopup.css';




export default function ChatPopup() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="chat-button" onClick={() => setOpen(!open)}>💬</div>

      {open && (
        <div className="chat-popup-window">
          <ChatBox onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
