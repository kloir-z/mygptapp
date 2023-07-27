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
  toggleMenu: () => void;
};

const getColor = (role: string) => {
  switch (role) {
    case 'system':
      return 'lightgray';
    case 'user':
      return '#4c586a';
    case 'assistant':
      return '#393e52';
    default:
      return 'white';
  }
};

const Message = styled.pre<{role: string}>`
  background-color: ${props => getColor(props.role)};
  padding: 10px;
  margin: 0px;
  text-align: left;
  font-family: Meiryo;
  font-size: 0.8rem;
  color: #ebebeb;
  white-space: pre-wrap;
`;

const ConversationContainer = styled.div`
  margin: 5px;
  flex: 1;
`;

const MessagesContainer = styled.div`
  overflow-y: auto;
  height: calc(100vh - 150px);  /* adjust this as per your needs */
`;

const InputContainer = styled.div`
  /* Styles can be added here */
`;

const StyledInput = styled.input`
  padding: 2px 6px;
  margin: 5px;
`;

const StyledSelect = styled.select`
  padding: 2px 6px;
  margin: 5px;
`;

const StyledOption = styled.option`
  padding: 2px 6px;
  margin: 5px;
`;

const StyledButton = styled.button`
  padding: 1px 6px;
  margin: 5px;
`;

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
        <MessageInput sendMessage={updateConversation} apiKey={apiKey} />
      </InputContainer>
    </ConversationContainer>
  );
};

export default Conversation;
