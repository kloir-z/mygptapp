//useAIResponse.ts
import { useRef } from 'react';
import { ConversationData } from 'src/components/types/Conversations.types';
import { getAIResponse } from 'src/utils/openAIUtil';

export const useAIResponse = (
  apiKey: string,
  model: string,
  displayMessages: ConversationData[],
  setReceivingMessage: React.Dispatch<React.SetStateAction<string>>,
  setReceivingId: React.Dispatch<React.SetStateAction<string>>,
  setQueuedMessageForReceivingId: React.Dispatch<React.SetStateAction<ConversationData | null>>,
) => {
  const stopReceiving = useRef(false);

  const awaitGetAIResponse = async (inputMessage?: string): Promise<void> => {
    stopReceiving.current = false;
    setReceivingMessage('')
    let updatedMessages = [...displayMessages];

    if (inputMessage) {
      updatedMessages.push({ role: 'user', content: inputMessage });
      setQueuedMessageForReceivingId({ role: 'user', content: inputMessage })
    }

    const aiResponse = await getAIResponse({ apiKey, model, messages: updatedMessages, stopReceiving, setReceivingMessage });
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
