import React, { useState } from 'react';
import styled from '@emotion/styled';
import { getAndSetTokenCount } from './openAIUtil';
import { ConversationData } from './Conversations';
import { MessageInputContainer, MessageInputBottomContainer, StyledTextarea, StyledButton, InfoText } from './MessageInput.styles'

type MessageInputProps = {
  sendMessage: (message: string, role: string, apiKey: string) => void;
  getAndSetTokenCount: (messages: ConversationData[], model: string, setTokenCount: React.Dispatch<React.SetStateAction<number>>) => void;
  messages: ConversationData[];
  apiKey: string;
  model: string;
};

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
