import React, { useState } from 'react';
import styled from '@emotion/styled';
import { getAndSetTokenCount } from './openAIUtil';

type MessageInputProps = {
  sendMessage: (message: string, role: string, apiKey: string) => void;
  apiKey: string;
};

const MessageInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  height: auto;
  resize: none;
  overflow: auto;
  padding: 10px 15px;
  font-size: 0.8rem;
  border-radius: 3px;
  border: 2px solid #ddd;
  box-sizing: border-box;
`;

const MessageInput: React.FC<MessageInputProps> = ({ sendMessage, apiKey }) => {
  const [message, setMessage] = useState('');
  const [inputTokenCount, setInputTokenCount] = useState<number>(0);

  const checkInputTokenCount = () => {
    getAndSetTokenCount([{role: 'user', content: message}], 'gpt-4-0613', setInputTokenCount);
  };

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
      <button type="button" onClick={checkInputTokenCount}>入力トークン数確認</button>
      <div>入力トークン数: {inputTokenCount}</div>
    </MessageInputContainer>
  );
};
export default MessageInput;
