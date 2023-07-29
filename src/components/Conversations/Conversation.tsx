import React, { useEffect, useState } from 'react';
import MessageInput from './MessageInput';
import { ConversationType, ConversationData } from './Conversations.types';
import { getAIResponse, getAndSetTokenCount } from './openAIUtil';
import { Message,ConversationContainer, MessagesContainer, InputContainer, StyledInput, StyledSelect, StyledOption, StyledButton } from './Conversation.styles'

type ConversationProps = {
  conversation: ConversationType;
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[]>>;
  setActiveConversation: React.Dispatch<React.SetStateAction<ConversationType | null>>;
  sendMessage: (updatedConversation: ConversationType) => Promise<void>;
  toggleMenu: () => void;
};

const Conversation: React.FC<ConversationProps> = ({
  conversation,
  sendMessage,
  toggleMenu
}) => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo-0613'); 
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
      <StyledButton onClick={toggleMenu}>Menu</StyledButton>
      <StyledInput type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="API Key" />
      <StyledSelect value={model} onChange={e => setModel(e.target.value)}>  
        <StyledOption value="gpt-3.5-turbo-16k-0613">gpt-3.5-turbo-16k-0613</StyledOption>
        <StyledOption value="gpt-3.5-turbo-0613">gpt-3.5-turbo-0613</StyledOption>
        <StyledOption value="gpt-4-0613">gpt-4-0613</StyledOption>
      </StyledSelect>
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