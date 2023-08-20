import { useState, useRef } from 'react';
import { ConversationData } from 'src/components/Conversations/types/Conversations.types';
import { getAIResponse } from 'src/utils/openAIUtil';

export const useAIResponse = (
  model: string,
  conversation: any,
  sendMessage: (updatedConversation: any) => Promise<void>,
  messages: ConversationData[],
  setMessages: React.Dispatch<React.SetStateAction<ConversationData[]>>,
  setReceivingMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  const stopReceiving = useRef(false);
  const [receivingId, setReceivingId] = useState<string>('');

  const awaitGetAIResponse = async (apiKey: string, messageContent?: string, role?: string): Promise<void> => {
    stopReceiving.current = false;
    setReceivingId(conversation.id);
    const finalMessages = await getAIResponse({
      apiKey, 
      model, 
      messages, 
      setMessages, 
      stopReceiving, 
      setReceivingMessage,
      messageContent, 
      role
    });
    setReceivingId('');
    stopReceiving.current = false;
    const updatedConversation = { ...conversation, revisions: [{ revision: '0', conversation: finalMessages }]};
    sendMessage(updatedConversation);
  };  

  const handleStopReceiving = () => {
    stopReceiving.current = true;
  };

  return {
    receivingId,
    setReceivingId,
    awaitGetAIResponse,
    handleStopReceiving
  };
};
