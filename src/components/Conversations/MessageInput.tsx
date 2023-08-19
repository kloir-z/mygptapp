import React, { useState, useRef, useEffect } from 'react';
import { getAndSetTokenCount } from '../../utils/openAIUtil';
import { ConversationData } from './types/Conversations.types';
import { MessageInputContainer, MessageInputBottomContainer, StyledTextarea, CalcTokenButton, SendButton, InputTokenText, MessageTokenText, InputCursorRef } from './styles/MessageInput.styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faStop } from '@fortawesome/free-solid-svg-icons'
import { Spinner } from './Spinner'
import { useDebugInfo } from 'src/components/Debugger/DebugContext';
import useScroll from 'src/hooks/useScroll'

type MessageInputProps = {
  awaitGetAIResponse: (message: string, role: string, apiKey: string) => void;
  getAndSetTokenCount: (messages: ConversationData[], model: string, setTokenCount: React.Dispatch<React.SetStateAction<number>>) => void;
  messages: ConversationData[];
  apiKey: string;
  model: string;
  totalTokenUpdateRequired: boolean;
  setTotalTokenUpdateRequired: React.Dispatch<React.SetStateAction<boolean>>;
  handleStopReceiving: () => void;
  scrollWrapperRef: React.RefObject<HTMLDivElement>
};

const MessageInput: React.FC<MessageInputProps> = ({ awaitGetAIResponse, apiKey, messages, model, totalTokenUpdateRequired, setTotalTokenUpdateRequired, handleStopReceiving, scrollWrapperRef }) => {
  const [message, setMessage] = useState('');
  const [inputTokenCount, setInputTokenCount] = useState<number>(0);
  const [totalTokenCount, setTotalTokenCount] = useState<number>(0);
  const [inputTokenLoading, setInputTokenLoading] = useState(false);
  const [totalTokenLoading, setTotalTokenLoading] = useState(false);
  const [inputTokenUpdateRequired, setInputTokenUpdateRequired] = useState(false);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false); 
  const { setDebugInfo } = useDebugInfo();
  const { messagesEndRef, scrollContainerRef } = useScroll(undefined, message);

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

  const handleGetAIResponse = async () => {
    if (message.trim() === '') {
      return;
    }
    setMessage('');
    setIsAwaitingResponse(true);
    try {
      await awaitGetAIResponse(message, 'user', apiKey);
    } finally {
      setIsAwaitingResponse(false);
    }
    setTotalTokenUpdateRequired(true);
  };

  const handleStopResponse = () => {
    setIsAwaitingResponse(false);
    handleStopReceiving();
  };

  useEffect(() => {
    scrollContainerRef.current = scrollWrapperRef.current;
  }, [scrollWrapperRef]);
  
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if(textAreaRef.current){
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
    if(!inputTokenUpdateRequired){
      setInputTokenUpdateRequired(true);
    }
  }, [message]);

  return (
    <>
      <MessageInputContainer>
      <InputCursorRef/>
      <StyledTextarea 
        value={message} 
        onChange={e => setMessage(e.target.value)}
        rows={message.split('\n').length || 1}
        ref={textAreaRef} 
      />
        <SendButton onClick={isAwaitingResponse ? handleStopResponse : handleGetAIResponse}>
          <FontAwesomeIcon icon={isAwaitingResponse ? faStop : faPaperPlane} />
        </SendButton>
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
      <div ref={messagesEndRef}></div>
    </>
  );
};

export default MessageInput;