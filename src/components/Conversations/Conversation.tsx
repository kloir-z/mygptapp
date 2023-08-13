import React, { useEffect, useState } from 'react';
import { ConversationType, ConversationData, SystemPromptType } from './types/Conversations.types';
import { getAndSetTokenCount } from '../../utils/openAIUtil';
import { ConversationContainer, MessagesContainer, InputContainer } from './styles/Conversation.styles'
import { useEditing } from 'src/hooks/useEditing';
import { useAIResponse } from 'src/hooks/useAIResponse'
import useScroll from 'src/hooks/useScroll'
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import InitialMenu from './InitialMenu';

type ConversationProps = {
  conversation: ConversationType;
  model: string;
  apiKey: string;
  sendMessage: (updatedConversation: ConversationType) => Promise<void>;
  forwardedRef: React.RefObject<HTMLDivElement>;
  systemprompts: SystemPromptType[];
  receivingId: string;
  setReceivingId: React.Dispatch<React.SetStateAction<string>>;
};

const Conversation: React.FC<ConversationProps> = ({ conversation, model, apiKey, sendMessage, systemprompts }) => {
  const [totalTokenUpdateRequired, setTotalTokenUpdateRequired] = useState(false);
  const [messages, setMessages] = useState<ConversationData[]>(conversation.revisions[0].conversation);

  const { editingMessageIndex, setEditingMessageIndex, tempMessageContent, onDoubleClickMessage, handleContentChange, handleConfirmEditing, handleCancelEditing, deleteMessage } = useEditing({sendMessage, conversation, messages ,setMessages});
  const { awaitGetAIResponse, handleStopReceiving } = useAIResponse(apiKey, model, conversation, sendMessage, messages, setMessages);
  const { scrollToBottom, messagesEndRef, forwardedRef } = useScroll(messages);

  const showInitialMenu = () => {
    return !messages.some(message => message.role === 'assistant');
  };

  useEffect(() => {
    setMessages(conversation.revisions[0].conversation);
    setEditingMessageIndex(null);
    setTotalTokenUpdateRequired(true);
    scrollToBottom();
  }, [conversation]);

  return (
    <ConversationContainer>
      <MessagesContainer ref={forwardedRef}>
        {showInitialMenu() && (
          <InitialMenu
            systemprompts={systemprompts}
            conversation={conversation}
            sendMessage={sendMessage}
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
        />
        <div ref={messagesEndRef} />
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
        />
      </InputContainer>
    </ConversationContainer>
  );
};

export default Conversation;