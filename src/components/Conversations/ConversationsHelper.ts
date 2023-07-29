import { useEffect, useState } from 'react';
import { Conversation as ConversationType, ConversationData } from './Conversations';
import { getAIResponse } from './openAIUtil';

export const useConversations = (
  conversation: ConversationType,
  sendMessage: (updatedConversation: ConversationType) => Promise<void>,
) => {
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

  return {
    apiKey,
    setApiKey,
    model,
    setModel,
    messages,
    setMessages,
    updateConversation,
  };
};
