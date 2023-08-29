//useAIResponse.ts
import { useRef } from 'react';
import { ConversationData } from 'src/components/Conversations/types/Conversations.types';
import { getAIResponse } from 'src/utils/openAIUtil';

export const useAIResponse = (
  model: string,
  messages: ConversationData[],
  setReceivingMessage: React.Dispatch<React.SetStateAction<string>>,
  setReceivingId: React.Dispatch<React.SetStateAction<string>>,
  setQueuedMessageForReceivingId: React.Dispatch<React.SetStateAction<ConversationData | null>>,
) => {
  const stopReceiving = useRef(false);

  const awaitGetAIResponse = async (apiKey: string, messageContent?: string, role?: string): Promise<void> => {
    stopReceiving.current = false;
    setReceivingMessage('')
    let updatedMessages = [...messages];

    if (messageContent) {
      updatedMessages.push({ role: 'user', content: messageContent });
      setQueuedMessageForReceivingId({ role: 'user', content: messageContent })
    }

    const aiResponse = await getAIResponse({ apiKey, model, messages: updatedMessages, stopReceiving, setReceivingMessage, messageContent, role });
    setQueuedMessageForReceivingId({ role: 'assistant', content: aiResponse })

    setReceivingMessage('')
    setReceivingId('')
    stopReceiving.current = false;
  };

  const handleStopReceiving = () => {
    stopReceiving.current = true;
  };

  return {
    awaitGetAIResponse,
    handleStopReceiving
  };
};
