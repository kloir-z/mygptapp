import React, { useState, useRef, useEffect } from 'react';
import { getAndSetTokenCount } from './openAIUtil';
import { ConversationData } from './Conversations.types';
import { MessageInputContainer, MessageInputBottomContainer, StyledTextarea, CalcTokenButton, SendButton, InputTokenText, MessageTokenText } from './MessageInput.styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

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
    const scrollPosition = window.scrollY;

    if (scrollHeight !== bodyHeight && (bodyHeight - scrollPosition - windowHeight) <= 50) {
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 5);
    }
  }, [scrollHeight]);

  return (
    <>
      <MessageInputContainer>
      <StyledTextarea 
        value={message} 
        onChange={e => setMessage(e.target.value)}
        rows={message.split('\n').length || 1}
        ref={textAreaRef} 
      />
        <SendButton onClick={handleSend}><FontAwesomeIcon icon={faPaperPlane} /></SendButton>
        <InputTokenText>{inputTokenCount}</InputTokenText>
        <MessageTokenText>{totalTokenCount}</MessageTokenText>
      </MessageInputContainer>
      <MessageInputBottomContainer>
        <CalcTokenButton type="button" onClick={checkTokenCount}>CalcToken</CalcTokenButton>
      </MessageInputBottomContainer>
    </>
  );
};
export default MessageInput;