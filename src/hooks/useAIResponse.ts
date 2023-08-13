import { useState, useRef } from 'react';
import { ConversationData } from 'src/components/Conversations/Conversations.types';
import { getAIResponse } from 'src/components/Conversations/openAIUtil';

export const useAIResponse = (
  apiKey: string,
  model: string,
  conversation: any,
  sendMessage: (updatedConversation: any) => Promise<void>,
  messages: ConversationData[],
  setMessages: React.Dispatch<React.SetStateAction<ConversationData[]>>
) => {
  const stopReceiving = useRef(false);
  const [receivingId, setReceivingId] = useState<string>('');

  const awaitGetAIResponse = async (messageContent: string, role: string): Promise<void> => {
    stopReceiving.current = false;
    setReceivingId(conversation.id);
    const finalMessages = await getAIResponse(messageContent, role, apiKey, model, messages, setMessages, stopReceiving);
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
