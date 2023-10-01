//Conversation.tsx
import React, { useEffect, useState } from 'react';
import { ConversationType, ConversationData, SystemPromptType } from '../../types/Conversations.types';
import { ConversationContainer, MessagesContainer, InputContainer, MessageDiv } from '../../styles/Conversation.styles'
import { useEditing } from 'src/hooks/useEditing';
import { useAIResponse } from 'src/hooks/useAIResponse'
import useScroll from 'src/hooks/useScroll'
import MessageInput from './MessageInput';
import MessageItem from '../SubComponents/MessageItem';
import InitialMenu from '../SubComponents/InitialMenu';
import SendButton from '../Parts/SendButton';
import ScrollControlButtons from '../Parts/ScrollControlButtons'; 
import { useDebugInfo } from 'src/components/Debugger/DebugContext';
import { Spinner } from '../Parts/Spinner';

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
  setQueuedMessageForReceivingId: React.Dispatch<React.SetStateAction<ConversationData | null>>;
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  isConversationLoading: boolean;
  setIsConversationLoading: React.Dispatch<React.SetStateAction<boolean>>;
  gcpApiKey: string;
  setGcpApiKey: React.Dispatch<React.SetStateAction<string>>;
};

const Conversation: React.FC<ConversationProps> = ({ activeConversation, model, apiKey, handleUpdateConversations, systemprompts, receivingId, setReceivingId, receivingMessage, setReceivingMessage, scrollWrapperRef, setQueuedMessageForReceivingId, inputMessage, setInputMessage, isConversationLoading, setIsConversationLoading, gcpApiKey, setGcpApiKey }) => {
  const [displayMessages, setDisplayMessages] = useState<ConversationData[]>(activeConversation.revisions[0].conversation);

  const { editingMessageIndex, setEditingMessageIndex, tempMessageContent, onDoubleClickMessage, handleContentChange, handleConfirmEditing, handleCancelEditing, deleteMessage, editTextAreaRef } = useEditing({handleUpdateConversations, activeConversation});
  const { awaitGetAIResponse, handleStopReceiving } = useAIResponse(apiKey, model, displayMessages, setReceivingMessage, setReceivingId, setQueuedMessageForReceivingId);
  const { messagesEndRef, scrollContainerRef, scrollToTop, scrollToBottom } = useScroll(displayMessages, receivingMessage, editingMessageIndex);
  const [showInitialMenu, setShowInitialMenu] = useState(false);
  const [isFadedIn, setIsFadedIn] = useState(false);
  const [autoRunOnLoad, setAutoRunOnLoad] = useState(false);

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
    setAutoRunOnLoad(false);
  }, [deleteMessage]);

  useEffect(() => {
    setEditingMessageIndex(null);
    setDisplayMessages(activeConversation.revisions[0].conversation);
    const hasAssistantMessage = activeConversation.revisions[0].conversation.some(message => message.role === 'assistant');
    const hasVoiceModeSystemMessage = activeConversation.revisions[0].conversation.some(message => message.role === 'system' && message.content.startsWith('音声会話モード'));
  
    const showMenu = !hasAssistantMessage || hasVoiceModeSystemMessage;
  
    setShowInitialMenu(showMenu);
    setIsConversationLoading(false);
  }, [activeConversation]);

  useEffect(() => {
    const hasAssistantMessage = activeConversation.revisions[0].conversation.some(message => message.role === 'assistant');
    const hasVoiceModeSystemMessage = activeConversation.revisions[0].conversation.some(message => message.role === 'system' && message.content.startsWith('音声会話モード'));
  
    const showMenu = !hasAssistantMessage || hasVoiceModeSystemMessage;
  
    setShowInitialMenu(showMenu);
  }, [receivingId]);

  useEffect(() => {
    if (isConversationLoading) {
      setIsFadedIn(false);
    } else {
      const timer = setTimeout(() => setIsFadedIn(true), 20);
      return () => clearTimeout(timer);
    }
  }, [isConversationLoading]);

  return (
    <ConversationContainer>
      {isConversationLoading ? (
        <div style={{width: '100%', height: '100%', display: 'flex', justifyContent:'center', alignItems:'center'}}><Spinner/></div>
      ) : (
        <>
          <div className={`fade-in ${isFadedIn ? 'show' : ''}`}>
            <MessagesContainer className="convScrollRef" ref={scrollContainerRef}>
              {showInitialMenu && (
                <InitialMenu
                  systemprompts={systemprompts}
                  activeConversation={activeConversation}
                  handleUpdateConversations={handleUpdateConversations}
                  gcpApiKey={gcpApiKey}
                  setGcpApiKey={setGcpApiKey}
                  apiKey={apiKey}
                  setAutoRunOnLoad={setAutoRunOnLoad}
                  receivingMessage={receivingMessage}
                />
              )}
              {displayMessages.map((ConversationData: ConversationData, index: number) => (
                <MessageItem
                  key={index}
                  ConversationData={ConversationData}
                  editing={editingMessageIndex === index}
                  index={index}
                  onDoubleClick={(e) => {
                    onDoubleClickMessage(e, displayMessages, index);
                  }}
                  handleConfirmEditing={handleConfirmEditing}
                  handleCancelEditing={handleCancelEditing}
                  deleteMessage={deleteMessage}
                  tempMessageContent={tempMessageContent}
                  handleContentChange={handleContentChange}
                  editTextAreaRef={editTextAreaRef}
                />
              ))}
              {receivingId === activeConversation.id &&<MessageDiv role='assistant'>{receivingMessage}</MessageDiv>}
              {showSendButton && (
                <div style={{position: 'relative'}}>
                  <SendButton
                    receivingId={receivingId}
                    awaitGetAIResponse={awaitGetAIResponse} 
                    handleStartResponse={handleStartResponse}
                    handleStopResponse={handleStopResponse}
                    autoRunOnLoad={autoRunOnLoad}
                  />
                </div>
              )}
              <div className="convEndRef" ref={messagesEndRef} />
              <ScrollControlButtons
                scrollToTop={scrollToTop}
                scrollToBottom={scrollToBottom}
                scrollContainerRef={scrollContainerRef}
                messagesEndRef={messagesEndRef}
              />
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
          </div>
        </>
      )}
    </ConversationContainer>
  );
};

export default Conversation;