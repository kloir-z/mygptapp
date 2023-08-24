import { useRef } from 'react';
import { ConversationType, ConversationData } from 'src/components/Conversations/types/Conversations.types';
import { getAIResponse } from 'src/utils/openAIUtil';

export const useAIResponse = (
  model: string,
  conversation: ConversationType,
  handleUpdateConversations: (handleUpdateConversations: ConversationType) => Promise<void>,
  messages: ConversationData[],
  setMessages: React.Dispatch<React.SetStateAction<ConversationData[]>>,
  setReceivingMessage: React.Dispatch<React.SetStateAction<string>>,
  receivingId: string,
) => {
  const stopReceiving = useRef(false);

  const awaitGetAIResponse = async (apiKey: string, messageContent?: string, role?: string): Promise<void> => {
    stopReceiving.current = false;
    const finalMessages = await getAIResponse({
      apiKey, 
      model, 
      messages, 
      setMessages, 
      stopReceiving, 
      setReceivingMessage,
      messageContent, 
      role,
      conversationId: conversation.id,
      receivingId
    });
    stopReceiving.current = false;
    const updatedConversation = { ...conversation, revisions: [{ revision: '0', conversation: finalMessages }]};
    handleUpdateConversations(updatedConversation);
  };  

  const handleStopReceiving = () => {
    stopReceiving.current = true;
  };

  return {
    awaitGetAIResponse,
    handleStopReceiving
  };
};
