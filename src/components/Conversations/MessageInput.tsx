import React, { useState, useRef, useEffect } from 'react';
import { getAndSetTokenCount } from './openAIUtil';
import { ConversationData } from './Conversations.types';
import { MessageInputContainer, MessageInputBottomContainer, StyledTextarea, CalcTokenButton, SendButton, InputTokenText, MessageTokenText } from './MessageInput.styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { Spinner } from './Sppiner'

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
  const [inputTokenLoading, setInputTokenLoading] = useState(false);
  const [totalTokenLoading, setTotalTokenLoading] = useState(false);
  const [inputTokenUpdateRequired, setInputTokenUpdateRequired] = useState(false);
  const [totalTokenUpdateRequired, setTotalTokenUpdateRequired] = useState(false);

  const checkTokenCount = async () => {
    if (inputTokenUpdateRequired) {
      setInputTokenLoading(true);
      await getAndSetTokenCount([{role: 'user', content: message}], model, setInputTokenCount);
      setInputTokenLoading(false);
      setInputTokenUpdateRequired(false);
    }
    if (totalTokenUpdateRequired) {
      setTotalTokenLoading(true);
      await getAndSetTokenCount([...messages], model, setTotalTokenCount);
      setTotalTokenLoading(false);
      setTotalTokenUpdateRequired(false);
    }
  };

  const handleSend = () => {
    if (message.trim() === '') {
      return;
    }
    sendMessage(message, 'user', apiKey);
    setMessage('');
    setInputTokenUpdateRequired(true);
    setTotalTokenUpdateRequired(true);
  };

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if(textAreaRef.current){
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      setScrollHeight(textAreaRef.current.scrollHeight);
    }
    setInputTokenUpdateRequired(true);
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
        {inputTokenLoading ? (
          <>
            <InputTokenText><Spinner /></InputTokenText>
          </>
        ) : (
          <>
            <InputTokenText>{inputTokenUpdateRequired ? ' ' : inputTokenCount}</InputTokenText>
          </>
        )}
        
        {totalTokenLoading ? (
          <>
            <MessageTokenText><Spinner /></MessageTokenText>
          </>
        ) : (
          <>
            <MessageTokenText>{totalTokenUpdateRequired ? ' ' : totalTokenCount}</MessageTokenText>
          </>
        )}
      </MessageInputContainer>
      <MessageInputBottomContainer>
        <CalcTokenButton type="button" onClick={checkTokenCount}>CalcToken</CalcTokenButton>
      </MessageInputBottomContainer>
    </>
  );
};
export default MessageInput;