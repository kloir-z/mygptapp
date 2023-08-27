//useAIResponse.ts
import { useRef } from 'react';
import { ConversationType, ConversationData } from 'src/components/Conversations/types/Conversations.types';
import { getAIResponse } from 'src/utils/openAIUtil';

export const useAIResponse = (
  model: string,
  activeConversation: ConversationType,
  handleUpdateConversations: (handleUpdateConversations: ConversationType, shouldUpdateFirestore: boolean) => Promise<void>,
  messages: ConversationData[],
  setReceivingMessage: React.Dispatch<React.SetStateAction<string>>,
  setReceivingId: React.Dispatch<React.SetStateAction<string>>,
  setUpdateMessagesState: React.Dispatch<React.SetStateAction<ConversationData | null>>,
) => {
  const stopReceiving = useRef(false);

  const awaitGetAIResponse = async (apiKey: string, messageContent?: string, role?: string): Promise<void> => {
    stopReceiving.current = false;
    setReceivingMessage('')
    let updatedMessages = [...messages];

    if (messageContent) {
      updatedMessages.push({ role: 'user', content: messageContent });
      setUpdateMessagesState({ role: 'user', content: messageContent })
      // handleUpdateConversations({ ...activeConversation, revisions: [{ revision: '0', conversation: updatedMessages }] }, false);
    }

    const aiResponse = await getAIResponse({ apiKey, model, messages: updatedMessages, stopReceiving, setReceivingMessage, messageContent, role });

    updatedMessages.push({ role: 'assistant', content: aiResponse });
    setUpdateMessagesState({ role: 'assistant', content: aiResponse })
    // handleUpdateConversations({ ...activeConversation, revisions: [{ revision: '0', conversation: updatedMessages }] }, true);

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
