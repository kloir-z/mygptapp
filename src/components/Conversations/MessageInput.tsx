import React, { useState } from 'react';
import styled from '@emotion/styled';
import { getAndSetTokenCount } from './openAIUtil';
import { ConversationData } from './Conversations';

type MessageInputProps = {
  sendMessage: (message: string, role: string, apiKey: string) => void;
  getAndSetTokenCount: (messages: ConversationData[], model: string, setTokenCount: React.Dispatch<React.SetStateAction<number>>) => void;
  messages: ConversationData[];
  apiKey: string;
  model: string;
};

const MessageInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const MessageInputBottomContainer = styled.div`
  display: flex;
  flex-direction: row;
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
  border: 1px solid #576374;
  box-sizing: border-box;
  color: #ebebeb;
  background-color: #4c586a;
;
`;

const StyledButton = styled.button`
  margin: 5px;
  padding: 5px 10px;
  font-size: 0.8rem;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  color: white;
  background: #336396;
  &:hover {
    background: #244569;
  }
`;

const InfoText = styled.div`
  margin: 5px;
  font-size: 0.8rem;
  color: #ebebeb;
`;

const MessageInput: React.FC<MessageInputProps> = ({ sendMessage, apiKey, messages, model }) => {
  const [message, setMessage] = useState('');
  const [inputTokenCount, setInputTokenCount] = useState<number>(0);
  const [totalTokenCount, setTotalTokenCount] = useState<number>(0);

  const checkTokenCount = () => {
    getAndSetTokenCount([...messages], model, setTotalTokenCount);
    getAndSetTokenCount([{role: 'user', content: message}], model, setInputTokenCount);
  };

  const handleSend = () => {
    if (message.trim() === '') {
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
      <MessageInputBottomContainer>
        <StyledButton onClick={handleSend}>Send</StyledButton>
        <StyledButton type="button" onClick={checkTokenCount}>calc</StyledButton>
        <InfoText>入力トークン数: {inputTokenCount}</InfoText>
        <InfoText>現在のトークン数: {totalTokenCount}</InfoText>
      </MessageInputBottomContainer>
    </MessageInputContainer>
  );
};
export default MessageInput;
