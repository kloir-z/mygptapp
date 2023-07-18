import React, { useEffect, useState } from 'react';
import MessageInput from './MessageInput';
import { Conversation as ConversationType, ConversationData } from './Conversations';
import getColor from './getColor';
import { getAIResponse } from './openAIUtil';

type ConversationProps = {
  conversation: ConversationType;
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[]>>;
  setActiveConversation: React.Dispatch<React.SetStateAction<ConversationType | null>>;
  sendMessage: (updatedConversation: ConversationType) => Promise<void>;
};

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
    <div style={{ margin: '1rem', flex: 1 }}>
      <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="API Key" />
      <select value={model} onChange={e => setModel(e.target.value)}>  {/* New model select dropdown */}
        <option value="gpt-3.5-turbo-16k-0613">gpt-3.5-turbo-16k-0613</option>
        <option value="gpt-3.5-turbo-0613">gpt-3.5-turbo-0613</option>
        <option value="gpt-4-0613">gpt-4-0613</option>
      </select>
      {messages.map((message: ConversationData, index: number) => (
        <pre key={index} style={{backgroundColor: getColor(message.role), padding: '10px', margin: '0px', textAlign: 'left'}}>
          {message.content}
        </pre>
      ))}
      <MessageInput sendMessage={updateConversation} apiKey={apiKey} />
    </div>
  );
};

export default Conversation;