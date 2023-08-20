import React, { useEffect, useState } from 'react';
import { ConversationType, ConversationData, SystemPromptType } from './types/Conversations.types';
import { getAndSetTokenCount } from '../../utils/openAIUtil';
import { ConversationContainer, MessagesContainer, InputContainer, MessageDiv } from './styles/Conversation.styles'
import { useEditing } from 'src/hooks/useEditing';
import { useAIResponse } from 'src/hooks/useAIResponse'
import useScroll from 'src/hooks/useScroll'
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import InitialMenu from './InitialMenu';
import SendButton from './SendButton';

type ConversationProps = {
  conversation: ConversationType;
  model: string;
  apiKey: string;
  handleUpdateConversations: (updatedConversation: ConversationType) => Promise<void>;
  systemprompts: SystemPromptType[];
  receivingId: string;
  setReceivingId: React.Dispatch<React.SetStateAction<string>>;
  showMenu: boolean;
  scrollWrapperRef: React.RefObject<HTMLDivElement>
};

const Conversation: React.FC<ConversationProps> = ({ conversation, model, apiKey, handleUpdateConversations, systemprompts, showMenu, scrollWrapperRef }) => {
  const [totalTokenUpdateRequired, setTotalTokenUpdateRequired] = useState(false);
  const [messages, setMessages] = useState<ConversationData[]>(conversation.revisions[0].conversation);
  const [receivingMessage, setReceivingMessage] = useState<string>('');

  const { editingMessageIndex, setEditingMessageIndex, tempMessageContent, onDoubleClickMessage, handleContentChange, handleConfirmEditing, handleCancelEditing, deleteMessage, editTextAreaRef } = useEditing({handleUpdateConversations, conversation, messages ,setMessages});
  const { awaitGetAIResponse, handleStopReceiving } = useAIResponse(model, conversation, handleUpdateConversations, messages, setMessages, setReceivingMessage);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false); 
  const { scrollToBottom, messagesEndRef, scrollContainerRef } = useScroll(messages, tempMessageContent, receivingMessage);
  const handleStartResponse = () => setIsAwaitingResponse(true);
  const handleStopResponse = () => {
    setIsAwaitingResponse(false);
    handleStopReceiving();
  };

  const showSendButton = messages[messages.length - 1]?.role === 'user' && editingMessageIndex === null;

  const showInitialMenu = () => {
    return !messages.some(message => message.role === 'assistant');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 210);
  
    return () => {
      clearTimeout(timer);
    };
  }, [showMenu]);

  useEffect(() => {
    setMessages(conversation.revisions[0].conversation);
    setEditingMessageIndex(null);
    setTotalTokenUpdateRequired(true);
    scrollToBottom();
  }, [conversation]);

  return (
    <ConversationContainer>
      <MessagesContainer className="convScrollRef" ref={scrollContainerRef}>
        {showInitialMenu() && (
          <InitialMenu
            systemprompts={systemprompts}
            conversation={conversation}
            handleUpdateConversations={handleUpdateConversations}
            messages={messages}
            setMessages={setMessages}
          />
        )}
        <MessageList
          messages={messages}
          editingMessageIndex={editingMessageIndex}
          tempMessageContent={tempMessageContent}
          onDoubleClickMessage={onDoubleClickMessage}
          handleContentChange={handleContentChange}
          handleConfirmEditing={handleConfirmEditing}
          handleCancelEditing={handleCancelEditing}
          deleteMessage={deleteMessage}
          editTextAreaRef={editTextAreaRef}
        />
        {receivingMessage && <MessageDiv role='assistant'>{receivingMessage}</MessageDiv>}
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
          awaitGetAIResponse={awaitGetAIResponse} 
          apiKey={apiKey} 
          getAndSetTokenCount={getAndSetTokenCount} 
          messages={messages} 
          model={model}
          totalTokenUpdateRequired={totalTokenUpdateRequired}
          setTotalTokenUpdateRequired={setTotalTokenUpdateRequired}
          handleStopReceiving={handleStopReceiving}
          scrollWrapperRef={scrollWrapperRef}
          setReceivingMessage={setReceivingMessage}
        />
      </InputContainer>
    </ConversationContainer>
  );
};

export default Conversation;