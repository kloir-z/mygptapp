//useEditing.ts
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
  editTextAreaRef: React.RefObject<HTMLTextAreaElement>;
};

type UseEditingProps = {
    handleUpdateConversations: (updatedConversation: ConversationType, shouldUpdateFirestore: boolean) => Promise<void>;
    activeConversation: ConversationType;
}

export const useEditing = ({handleUpdateConversations, activeConversation}:UseEditingProps ): UseEditingReturnType => {
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);
  const [tempMessageContent, setTempMessageContent] = useState<string | null>(null);

  const onDoubleClickMessage = (messages: ConversationData[], index: number) => {
    setEditingMessageIndex(index);
    setTempMessageContent(messages[index]?.content || null);
  };

  const handleContentChange = (newContent: string) => {
    setTempMessageContent(newContent);
  };

  const handleConfirmEditing = async (index: number) => {
    if (tempMessageContent !== null) {
      const updatedConversation = { ...activeConversation };
      updatedConversation.revisions[0].conversation = updatedConversation.revisions[0].conversation.map((message, i) => {
        if (i === index && typeof message.content === 'string') {
          return { ...message, content: tempMessageContent };
        }
        return message;
      });
      await handleUpdateConversations(updatedConversation, true);
    }
    setEditingMessageIndex(null);
    setTempMessageContent(null);
  };

  const handleCancelEditing = () => {
    setEditingMessageIndex(null);
    setTempMessageContent(null);
  };

  const deleteMessage = async (index: number) => {
    const updatedConversation = { ...activeConversation };
    updatedConversation.revisions[0].conversation = updatedConversation.revisions[0].conversation.filter((_, idx) => idx !== index);
    await handleUpdateConversations(updatedConversation, true);
    setEditingMessageIndex(null);
  };

  const editTextAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (editTextAreaRef.current && editingMessageIndex !== null) {
      editTextAreaRef.current.style.height = 'auto';
      editTextAreaRef.current.style.height = `${editTextAreaRef.current.scrollHeight}px`;
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
    deleteMessage,
    editTextAreaRef 
  };
};