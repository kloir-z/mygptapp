import React, { useState, useRef, useEffect } from 'react';
import { getAndSetTokenCount } from './openAIUtil';
import { ConversationData } from './Conversations.types';
import { MessageInputBottomContainer, StyledTextarea, StyledButton, InfoText } from './MessageInput.styles'

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
  const [debugInfo, setDebugInfo] = useState({scrollTop: 0, clientHeight: 0, scrollHeight: 0}); 

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

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setDebugInfo({
      scrollTop: window.scrollY, 
      clientHeight: window.innerHeight,
      scrollHeight: document.body.scrollHeight
    }); // 更新
    if (window.scrollY + window.innerHeight + 40 >= document.body.scrollHeight) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
    }
  }, [message]);

  return (
    <>
      <div style={{display:'flex', flexDirection: 'row'}}><InfoText>a: {debugInfo.scrollTop}</InfoText>      <InfoText>b: {debugInfo.clientHeight}</InfoText>      <InfoText>c: {debugInfo.scrollHeight}</InfoText></div>
      <StyledTextarea 
        value={message} 
        onChange={e => setMessage(e.target.value)}
        rows={message.split('\n').length || 1}
        ref={textAreaRef} 
      />
      <MessageInputBottomContainer>
        <StyledButton onClick={handleSend}>Send</StyledButton>
        <StyledButton type="button" onClick={checkTokenCount}>calc</StyledButton>
        <InfoText>in: {inputTokenCount}</InfoText>
        <InfoText>m: {totalTokenCount}</InfoText>
      </MessageInputBottomContainer>
    </>
  );
};
export default MessageInput;
