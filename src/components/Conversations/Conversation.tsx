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

type ConversationProps = {
  activeConversation: ConversationType;
  model: string;
  apiKey: string;
  handleUpdateConversations: (updatedConversation: ConversationType, shouldUpdateFirestore: boolean) => Promise<void>;
  systemprompts: SystemPromptType[];
  receivingId: string;
  setReceivingId: React.Dispatch<React.SetStateAction<string>>;
  scrollWrapperRef: React.RefObject<HTMLDivElement>
};

const Conversation: React.FC<ConversationProps> = ({ activeConversation, model, apiKey, handleUpdateConversations, systemprompts, receivingId, setReceivingId, scrollWrapperRef }) => {
  const [totalTokenUpdateRequired, setTotalTokenUpdateRequired] = useState(false);
  const [displayMessages, setDisplayMessages] = useState<ConversationData[]>(activeConversation.revisions[0].conversation);
  const [receivingMessage, setReceivingMessage] = useState<string>('');
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false); 

  const { editingMessageIndex, setEditingMessageIndex, tempMessageContent, onDoubleClickMessage, handleContentChange, handleConfirmEditing, handleCancelEditing, deleteMessage, editTextAreaRef } = useEditing({handleUpdateConversations, activeConversation, displayMessages ,setDisplayMessages});
  const { awaitGetAIResponse, handleStopReceiving } = useAIResponse(model, activeConversation, handleUpdateConversations, displayMessages, setReceivingMessage, setReceivingId);
  const { scrollToBottom, messagesEndRef, scrollContainerRef } = useScroll(displayMessages, tempMessageContent, receivingMessage);
  const { setDebugInfo } = useDebugInfo();
  const handleStartResponse = () => {
    setIsAwaitingResponse(true);
    setReceivingId(activeConversation.id);
  };

  const handleStopResponse = () => {
    setIsAwaitingResponse(false);
    handleStopReceiving();
  };

  const showSendButton = displayMessages[displayMessages.length - 1]?.role === 'user' && editingMessageIndex === null && !isAwaitingResponse;

  const showInitialMenu = () => {
    return !displayMessages.some(message => message.role === 'assistant');
  };

  useEffect(() => {
    setDebugInfo(`id: ${activeConversation.id} , rcvid: ${receivingId}, isAwaitingResponse: ${isAwaitingResponse}`);
  }, [activeConversation.id, receivingId, isAwaitingResponse]);

  useEffect(() => {
    setDisplayMessages(activeConversation.revisions[0].conversation);
    setEditingMessageIndex(null);
    setTotalTokenUpdateRequired(true);
    scrollToBottom();
  }, [activeConversation]);

  return (
    <ConversationContainer>
      <MessagesContainer className="convScrollRef" ref={scrollContainerRef}>
        {showInitialMenu() && (
          <InitialMenu
            systemprompts={systemprompts}
            conversation={activeConversation}
            handleUpdateConversations={handleUpdateConversations}
            displayMessages={displayMessages}
            setDisplayMessages={setDisplayMessages}
          />
        )}
        {displayMessages.map((message: ConversationData, index: number) => (
          <MessageItem
            key={index}
            message={message}
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
              isAwaitingResponse={isAwaitingResponse}
              awaitGetAIResponse={awaitGetAIResponse} 
              handleStartResponse={handleStartResponse}
              handleStopResponse={handleStopResponse}
              apiKey={apiKey}
            />
          </div>
        )}
        <div className="convEndRef" ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer>
        <MessageInput 
          isAwaitingResponse={isAwaitingResponse}
          awaitGetAIResponse={awaitGetAIResponse} 
          handleStartResponse={handleStartResponse}
          handleStopResponse={handleStopResponse}
          apiKey={apiKey} 
          displayMessages={displayMessages} 
          model={model}
          totalTokenUpdateRequired={totalTokenUpdateRequired}
          setTotalTokenUpdateRequired={setTotalTokenUpdateRequired}
          scrollWrapperRef={scrollWrapperRef}
          setReceivingMessage={setReceivingMessage}
        />
      </InputContainer>
    </ConversationContainer>
  );
};

export default Conversation;