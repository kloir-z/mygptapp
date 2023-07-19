import React, { useState } from 'react';
import styled from '@emotion/styled';

type MessageInputProps = {
  sendMessage: (message: string, role: string, apiKey: string) => void;
  apiKey: string;
};

const MessageInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const StyledTextarea = styled.textarea`
  margin-top: 10px;
  width: 97%;
  padding: 10px;
  height: auto;
  resize: none;
  overflow: auto;
`;

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
    <MessageInputContainer>
      <StyledTextarea 
        value={message} 
        onChange={e => setMessage(e.target.value)}
        rows={message.split('\n').length || 1}
      />
      <button onClick={handleSend}>Send</button>
    </MessageInputContainer>
  );
};
export default MessageInput;
