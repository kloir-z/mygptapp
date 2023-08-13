import { useState, useRef, useEffect } from 'react';
import { ConversationType, ConversationData } from 'src/components/Conversations/types/Conversations.types';

type UseEditingReturnType = {
  editingMessageIndex: number | null;
  tempMessageContent: string | null;
  setEditingMessageIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setTempMessageContent: React.Dispatch<React.SetStateAction<string | null>>;
  onDoubleClickMessage: (messages: ConversationData[], index: number) => void;
  handleContentChange: (newContent: string) => void;
  handleConfirmEditing: (index: number) => void;
  handleCancelEditing: () => void;
  deleteMessage: (index: number) => void;
};

type UseEditingProps = {
    sendMessage: (updatedConversation: ConversationType) => Promise<void>;
    conversation: ConversationType;
    messages: ConversationData[],
    setMessages: React.Dispatch<React.SetStateAction<ConversationData[]>>
}

export const useEditing = ({sendMessage, conversation, messages, setMessages}:UseEditingProps ): UseEditingReturnType => {
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);
  const [tempMessageContent, setTempMessageContent] = useState<string | null>(null);

  const onDoubleClickMessage = (messages: ConversationData[], index: number) => {
    setEditingMessageIndex(index);
    setTempMessageContent(messages[index]?.content || null);
  };

  const handleContentChange = (newContent: string) => {
    setTempMessageContent(newContent);
  };

  const handleConfirmEditing = (index: number) => {
    if (tempMessageContent !== null) {
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        updatedMessages[index].content = tempMessageContent;
        return updatedMessages;
      });
    }
    setEditingMessageIndex(null);
    setTempMessageContent(null);
  };

  const handleCancelEditing = () => {
    setEditingMessageIndex(null);
    setTempMessageContent(null);
  };
  
  const deleteMessage = (index: number) => {
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages];
      updatedMessages.splice(index, 1);
      return updatedMessages;
    });
  
    const updatedConversation = { ...conversation, revisions: [{ revision: '0', conversation: messages.filter((_, idx) => idx !== index)}]};
    sendMessage(updatedConversation);
    setEditingMessageIndex(null);
  };

  const editTextAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (editTextAreaRef.current && editingMessageIndex !== null) {
      const content = tempMessageContent;
      if (content) {
        editTextAreaRef.current.style.height = 'auto';
        editTextAreaRef.current.style.height = `${editTextAreaRef.current.scrollHeight}px`;
      }
    }
  }, [tempMessageContent, editingMessageIndex]);  

  return {
    editingMessageIndex,
    tempMessageContent,
    setEditingMessageIndex,
    setTempMessageContent,
    onDoubleClickMessage,
    handleContentChange,
    handleConfirmEditing,
    handleCancelEditing,
    deleteMessage
  };
};
