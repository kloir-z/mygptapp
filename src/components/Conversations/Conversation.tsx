import React, { useEffect, useState } from 'react';
import MessageInput from './MessageInput';
import { ConversationType, ConversationData } from './Conversations.types';
import { getAIResponse, getAndSetTokenCount } from './openAIUtil';
import { Message, ConversationContainer, MessagesContainer, InputContainer } from './Conversation.styles'

type ConversationProps = {
  conversation: ConversationType;
  model: string;
  apiKey: string;
  sendMessage: (updatedConversation: ConversationType) => Promise<void>;
};

const Conversation: React.FC<ConversationProps> = ({ conversation, model, apiKey, sendMessage}) => {
  const [messages, setMessages] = useState<ConversationData[]>(conversation.revisions[0].conversation);

  useEffect(() => {
    setMessages(conversation.revisions[0].conversation);
  }, [conversation, model]);
  
  const updateConversation  = async (messageContent: string, role: string, apiKey: string) => { 
    const finalMessages = await getAIResponse(messageContent, role, apiKey, model, messages, setMessages); 
    const updatedConversation = {
      ...conversation,
      revisions: [{
        revision: '0',
        conversation: finalMessages
      }]
    };
    sendMessage(updatedConversation);
  };

  return (
    <ConversationContainer>
      <MessagesContainer>
        {messages.map((message: ConversationData, index: number) => (
          <Message key={index} role={message.role}>
            {message.content}
          </Message>
        ))}
      </MessagesContainer>
      <InputContainer>
        <MessageInput 
          sendMessage={updateConversation} 
          apiKey={apiKey} 
          getAndSetTokenCount={getAndSetTokenCount} 
          messages={messages} 
          model={model}
        />
      </InputContainer>
    </ConversationContainer>
  );
};

export default Conversation;