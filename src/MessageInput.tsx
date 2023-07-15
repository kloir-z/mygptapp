import React, { useState } from 'react';

type MessageInputProps = {
  addMessage: (message: string) => void;
};

const MessageInput: React.FC<MessageInputProps> = ({ addMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    addMessage(message);
    setMessage('');
  };

  return (
    <div>
      <textarea value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default MessageInput;
