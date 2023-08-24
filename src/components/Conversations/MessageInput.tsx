import React, { useState, useRef, useEffect } from 'react';
import { ConversationData } from './types/Conversations.types';
import { MessageInputContainer, StyledTextarea, InputCursorRef } from './styles/MessageInput.styles'
import { useDebugInfo } from 'src/components/Debugger/DebugContext';
import useScroll from 'src/hooks/useScroll'
import SendButton from './SendButton';
import TokenCounter from './TokenCounter';

type MessageInputProps = {
  isAwaitingResponse: boolean;
  awaitGetAIResponse: (apiKey: string, message?: string, role?: string) => Promise<void>;
  handleStartResponse: () => void;
  handleStopResponse: () => void;
  messages: ConversationData[];
  apiKey: string;
  model: string;
  totalTokenUpdateRequired: boolean;
  setTotalTokenUpdateRequired: React.Dispatch<React.SetStateAction<boolean>>;
  handleStopReceiving: () => void;
  scrollWrapperRef: React.RefObject<HTMLDivElement>
  setReceivingMessage: React.Dispatch<React.SetStateAction<string>>;
};

const MessageInput: React.FC<MessageInputProps> = ({ isAwaitingResponse, awaitGetAIResponse, handleStartResponse, handleStopResponse, apiKey, messages, model, totalTokenUpdateRequired, setTotalTokenUpdateRequired, handleStopReceiving, scrollWrapperRef }) => {
  const [message, setMessage] = useState('');
  const { messagesEndRef, scrollContainerRef } = useScroll(undefined, message);
  const [inputTokenUpdateRequired, setInputTokenUpdateRequired] = useState(false);
  const { setDebugInfo } = useDebugInfo();

  useEffect(() => {
    scrollContainerRef.current = scrollWrapperRef.current;
  }, [scrollWrapperRef]);
  
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if(textAreaRef.current){
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
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
      <SendButton
        setMessage={setMessage} 
        isAwaitingResponse={isAwaitingResponse}
        awaitGetAIResponse={async (apiKey, message, role) => awaitGetAIResponse(apiKey, message, role)}
        handleStartResponse={handleStartResponse}
        handleStopResponse={handleStopResponse}
        apiKey={apiKey}
        message={message}
        disabled={message.trim() === ''}
      />
      <TokenCounter
        messages={messages}
        model={model}
        totalTokenUpdateRequired={totalTokenUpdateRequired}
        setTotalTokenUpdateRequired={setTotalTokenUpdateRequired}
        inputTokenUpdateRequired={inputTokenUpdateRequired}
        setInputTokenUpdateRequired={setInputTokenUpdateRequired}
        message={message}
      />
      </MessageInputContainer>
      <div ref={messagesEndRef}></div>
    </>
  );
};

export default MessageInput;