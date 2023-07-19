import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import MessageInput from './MessageInput';
import { Conversation as ConversationType, ConversationData } from './Conversations';
import { getAIResponse } from './openAIUtil';

type ConversationProps = {
  conversation: ConversationType;
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[]>>;
  setActiveConversation: React.Dispatch<React.SetStateAction<ConversationType | null>>;
  sendMessage: (updatedConversation: ConversationType) => Promise<void>;
};

const getColor = (role: string) => {
  switch (role) {
    case 'system':
      return 'lightgray';
    case 'user':
      return '#eaf0ff';
    case 'assistant':
      return '#edffed';
    default:
      return 'white';
  }
};

const Message = styled.pre<{role: string}>`
  background-color: ${props => getColor(props.role)};
  padding: 10px;
  margin: 0px;
  text-align: left;
`;

const ConversationContainer = styled.div`
  margin: 1rem;
  flex: 1;
`;

const StyledInput = styled.input`
  /* Styles can be added here */
`;

const StyledSelect = styled.select`
  /* Styles can be added here */
`;

const StyledOption = styled.option`
  /* Styles can be added here */
`;

const Conversation: React.FC<ConversationProps> = ({
  conversation,
  sendMessage
}) => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo-0613'); 
  const [messages, setMessages] = useState<ConversationData[]>(conversation.revisions[0].conversation);

  useEffect(() => {
    setMessages(conversation.revisions[0].conversation);
  }, [conversation]);
  
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
      <StyledInput type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="API Key" />
      <StyledSelect value={model} onChange={e => setModel(e.target.value)}>  {/* New model select dropdown */}
        <StyledOption value="gpt-3.5-turbo-16k-0613">gpt-3.5-turbo-16k-0613</StyledOption>
        <StyledOption value="gpt-3.5-turbo-0613">gpt-3.5-turbo-0613</StyledOption>
        <StyledOption value="gpt-4-0613">gpt-4-0613</StyledOption>
      </StyledSelect>
      {messages.map((message: ConversationData, index: number) => (
        <Message key={index} role={message.role}>
          {message.content}
        </Message>
      ))}
      <MessageInput sendMessage={updateConversation} apiKey={apiKey} />
    </ConversationContainer>
  );
};

export default Conversation;
