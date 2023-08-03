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
  const [scrollHeight, setScrollHeight] = useState<number>(0);

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
    if(textAreaRef.current){
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      setScrollHeight(textAreaRef.current.scrollHeight);
    }
  }, [message]);

  useEffect(() => {
    const windowHeight = window.innerHeight;
    const bodyHeight = document.body.scrollHeight;
    const scrollPosition = window.pageYOffset;

    const isContentHeightChanged = scrollHeight !== bodyHeight;
    const isNearBottom = (bodyHeight - scrollPosition - windowHeight) <= 50; // 50px の範囲内であれば下部とみなす

    if (isContentHeightChanged && isNearBottom) {
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 5); //テキストエリアが広がった後にtriggerさせる想定
    }

  }, [scrollHeight]);

  return (
    <>
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
