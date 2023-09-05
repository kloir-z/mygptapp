//Conversation.tsx
import React, { useEffect, useState } from 'react';
import { ConversationType, ConversationData, SystemPromptType } from './types/Conversations.types';
import { ConversationContainer, MessagesContainer, InputContainer, MessageDiv } from './styles/Conversation.styles'
import { useEditing } from 'src/hooks/useEditing';
import { useAIResponse } from 'src/hooks/useAIResponse'
import useScroll from 'src/hooks/useScroll'
import MessageInput from './MessageInput';
import MessageItem from './MessageItem';
import InitialMenu from './InitialMenu';
import SendButton from './SendButton';
import { useDebugInfo } from 'src/components/Debugger/DebugContext';
import SpinnerFull from './SpinnerFull';

type ConversationProps = {
  activeConversation: ConversationType;
  model: string;
  apiKey: string;
  handleUpdateConversations: (updatedConversation: ConversationType, shouldUpdateFirestore: boolean) => Promise<void>;
  systemprompts: SystemPromptType[];
  receivingId: string;
  setReceivingId: React.Dispatch<React.SetStateAction<string>>;
  receivingMessage: string;
  setReceivingMessage: React.Dispatch<React.SetStateAction<string>>;
  scrollWrapperRef: React.RefObject<HTMLDivElement>;
  setqueuedMessageForReceivingId: React.Dispatch<React.SetStateAction<ConversationData | null>>;
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  isConversationLoading: boolean;
  setIsConversationLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const Conversation: React.FC<ConversationProps> = ({ activeConversation, model, apiKey, handleUpdateConversations, systemprompts, receivingId, setReceivingId, receivingMessage, setReceivingMessage, scrollWrapperRef, setqueuedMessageForReceivingId, inputMessage, setInputMessage, isConversationLoading, setIsConversationLoading }) => {
  const [displayMessages, setDisplayMessages] = useState<ConversationData[]>(activeConversation.revisions[0].conversation);

  const { editingMessageIndex, setEditingMessageIndex, tempMessageContent, onDoubleClickMessage, handleContentChange, handleConfirmEditing, handleCancelEditing, deleteMessage, editTextAreaRef } = useEditing({handleUpdateConversations, activeConversation});
  const { awaitGetAIResponse, handleStopReceiving } = useAIResponse(apiKey, model, displayMessages, setReceivingMessage, setReceivingId, setqueuedMessageForReceivingId);
  const { messagesEndRef, scrollContainerRef } = useScroll(displayMessages, receivingMessage, editingMessageIndex);
  const [ showInitialMenu, setShowInitialMenu] = useState(false);

  const { setDebugInfo } = useDebugInfo();
  const handleStartResponse = () => {
    setReceivingId(activeConversation.id);
  };

  const handleStopResponse = () => {
    handleStopReceiving();
  };

  const showSendButton = displayMessages[displayMessages.length - 1]?.role === 'user' && editingMessageIndex === null && !receivingId;

  useEffect(() => {
    // setDebugInfo(`id: ${activeConversation.id} , rcvid: ${receivingId}`);
  }, [activeConversation.id, receivingId]);

  useEffect(() => {
    setEditingMessageIndex(null);
    setDisplayMessages(activeConversation.revisions[0].conversation);
    const showMenu = !activeConversation.revisions[0].conversation.some(message => message.role === 'assistant');
    setShowInitialMenu(showMenu);
    setIsConversationLoading(false);
  }, [activeConversation]);

  return (
    <ConversationContainer>
      {isConversationLoading ? (
        <SpinnerFull /> // スピナーを表示
      ) : (
        <>
        <MessagesContainer className="convScrollRef" ref={scrollContainerRef}>
          {showInitialMenu && (
            <InitialMenu
              systemprompts={systemprompts}
              activeConversation={activeConversation}
              handleUpdateConversations={handleUpdateConversations}
            />
          )}
          {displayMessages.map((ConversationData: ConversationData, index: number) => (
            <MessageItem
              key={index}
              ConversationData={ConversationData}
              editing={editingMessageIndex === index}
              index={index}
              onDoubleClick={() => onDoubleClickMessage(displayMessages, index)}
              handleConfirmEditing={handleConfirmEditing}
              handleCancelEditing={handleCancelEditing}
              deleteMessage={deleteMessage}
              tempMessageContent={tempMessageContent}
              handleContentChange={handleContentChange}
              editTextAreaRef={editTextAreaRef}
            />
          ))}
          {receivingMessage && receivingId === activeConversation.id &&<MessageDiv role='assistant'>{receivingMessage}</MessageDiv>}
          {showSendButton && (
            <div style={{position: 'relative'}}>
              <SendButton
                receivingId={receivingId}
                awaitGetAIResponse={awaitGetAIResponse} 
                handleStartResponse={handleStartResponse}
                handleStopResponse={handleStopResponse}
              />
            </div>
          )}
          <div className="convEndRef" ref={messagesEndRef} />
        </MessagesContainer>
        <InputContainer>
          <MessageInput 
            receivingId={receivingId}
            awaitGetAIResponse={awaitGetAIResponse} 
            handleStartResponse={handleStartResponse}
            handleStopResponse={handleStopResponse}
            apiKey={apiKey} 
            scrollWrapperRef={scrollWrapperRef}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
          />
        </InputContainer>
        </>
      )}
    </ConversationContainer>
  );
};

export default Conversation;