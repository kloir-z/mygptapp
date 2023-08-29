//MessageInput.tsx
import React, { useRef, useEffect } from 'react';
import { MessageInputContainer, StyledTextarea } from './styles/MessageInput.styles'
import { useDebugInfo } from 'src/components/Debugger/DebugContext';
import useScroll from 'src/hooks/useScroll'
import SendButton from './SendButton';

type MessageInputProps = {
  receivingId: string;
  awaitGetAIResponse: (apiKey: string, message?: string, role?: string) => Promise<void>;
  handleStartResponse: () => void;
  handleStopResponse: () => void;
  apiKey: string;
  scrollWrapperRef: React.RefObject<HTMLDivElement>;
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
};

const MessageInput: React.FC<MessageInputProps> = ({ receivingId, awaitGetAIResponse, handleStartResponse, handleStopResponse, apiKey, scrollWrapperRef, inputMessage, setInputMessage }) => {
  const { messagesEndRef, scrollContainerRef } = useScroll(undefined, inputMessage);
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
  }, [inputMessage]);

  return (
    <>
      <MessageInputContainer>
      <StyledTextarea
        value={inputMessage}
        onChange={e => setInputMessage(e.target.value)}
        rows={inputMessage.split('\n').length || 1}
        ref={textAreaRef}
      />
      <SendButton
        receivingId={receivingId}
        awaitGetAIResponse={async (apiKey, message, role) => awaitGetAIResponse(apiKey, message, role)}
        handleStartResponse={handleStartResponse}
        handleStopResponse={handleStopResponse}
        apiKey={apiKey}
        message={inputMessage}
        setMessage={setInputMessage} 
        disabled={inputMessage.trim() === '' && !receivingId}
      />
      </MessageInputContainer>
      <div ref={messagesEndRef}></div>
    </>
  );
};

export default MessageInput;