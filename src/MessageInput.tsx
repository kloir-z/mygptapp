import React, { useState } from 'react';

type MessageInputProps = {
  sendMessage: (message: string, role: string, apiKey: string, model: string) => void;
  apiKey: string;
};

const MessageInput: React.FC<MessageInputProps> = ({ sendMessage, apiKey }) => {
  const [message, setMessage] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo-16k-0613');

  const handleSend = () => {
    if (message.trim() === '') {
      // Message is empty, do nothing
      return;
    }
    sendMessage(message, 'user', apiKey, model);
    setMessage('');
  };

  return (
    <div>
      <textarea value={message} onChange={e => setMessage(e.target.value)} />
      <select value={model} onChange={e => setModel(e.target.value)}>
        <option value="gpt-3.5-turbo-16k-0613">gpt-3.5-turbo-16k-0613</option>
        <option value="gpt-3.5-turbo-0613">gpt-3.5-turbo-0613</option>
        <option value="gpt-4-0613">gpt-4-0613</option>
      </select>
      <button onClick={handleSend}>Send</button>
    </div>
  );
};
export default MessageInput;

