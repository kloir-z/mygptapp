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
  conversation: ConversationType;
  model: string;
  apiKey: string;
  handleUpdateConversations: (updatedConversation: ConversationType) => Promise<void>;
  systemprompts: SystemPromptType[];
  receivingId: string;
  setReceivingId: React.Dispatch<React.SetStateAction<string>>;
  scrollWrapperRef: React.RefObject<HTMLDivElement>
};

const Conversation: React.FC<ConversationProps> = ({ conversation, model, apiKey, handleUpdateConversations, systemprompts, receivingId, setReceivingId, scrollWrapperRef }) => {
  const [totalTokenUpdateRequired, setTotalTokenUpdateRequired] = useState(false);
  const [messages, setMessages] = useState<ConversationData[]>(conversation.revisions[0].conversation);
  const [receivingMessage, setReceivingMessage] = useState<string>('');
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false); 

  const { editingMessageIndex, setEditingMessageIndex, tempMessageContent, onDoubleClickMessage, handleContentChange, handleConfirmEditing, handleCancelEditing, deleteMessage, editTextAreaRef } = useEditing({handleUpdateConversations, conversation, messages ,setMessages});
  const { awaitGetAIResponse, handleStopReceiving } = useAIResponse(model, conversation, handleUpdateConversations, messages, setMessages, setReceivingMessage);
  const { scrollToBottom, messagesEndRef, scrollContainerRef } = useScroll(messages, tempMessageContent, receivingMessage);
  const { setDebugInfo } = useDebugInfo();
  const handleStartResponse = () => {
    setIsAwaitingResponse(true);
    setReceivingId(conversation.id);
  };

  const handleStopResponse = () => {
    setIsAwaitingResponse(false);
    handleStopReceiving();
  };

  const showSendButton = messages[messages.length - 1]?.role === 'user' && editingMessageIndex === null && !isAwaitingResponse;

  const showInitialMenu = () => {
    return !messages.some(message => message.role === 'assistant');
  };

  useEffect(() => {
    setDebugInfo(`id: ${conversation.id} , rcvid: ${receivingId}, isAwaitingResponse: ${isAwaitingResponse}`);
  }, [conversation.id, receivingId, isAwaitingResponse]);

  useEffect(() => {
    setMessages(conversation.revisions[0].conversation);
    setEditingMessageIndex(null);
    setTotalTokenUpdateRequired(true);
    scrollToBottom();
  }, [conversation.id]);

  useEffect(() => {
    if (!isAwaitingResponse) {
      setReceivingId('')
    }
  },[isAwaitingResponse])

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
        {messages.map((message: ConversationData, index: number) => (
          <MessageItem
            key={index}
            message={message}
            editing={editingMessageIndex === index}
            index={index}
            onDoubleClick={() => onDoubleClickMessage(messages, index)}
            handleConfirmEditing={handleConfirmEditing}
            handleCancelEditing={handleCancelEditing}
            deleteMessage={deleteMessage}
            tempMessageContent={tempMessageContent}
            handleContentChange={handleContentChange}
            editTextAreaRef={editTextAreaRef}
          />
        ))}
        {receivingMessage && receivingId === conversation.id &&<MessageDiv role='assistant'>{receivingMessage}</MessageDiv>}
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
          messages={messages} 
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