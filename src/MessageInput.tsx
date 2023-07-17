import React, { useState } from 'react';

type MessageInputProps = {
  sendMessage: (message: string, role: string, apiKey: string) => void;
  apiKey: string;
};

const MessageInput: React.FC<MessageInputProps> = ({ sendMessage, apiKey }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() === '') {
      // Message is empty, do nothing
      return;
    }
    sendMessage(message, 'user', apiKey);
    setMessage('');
  };

  return (
    <div>
       <textarea 
        value={message} 
        onChange={e => setMessage(e.target.value)}
        style={{
          marginTop: '10px',
          width: '97%',
          padding: '10px',
          height: 'auto',
          resize: 'none',
          overflow: 'auto',
        }}
        rows={message.split('\n').length || 1}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};
export default MessageInput;
