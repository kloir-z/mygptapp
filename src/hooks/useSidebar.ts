//useSidebar.ts
import { useState } from 'react';
import { ConversationType } from 'src/types/Conversations.types';

const useSidebar = (
  conversations: ConversationType[],
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[]>>,
  handleUpdateConversations: (updatedConversation: ConversationType) => Promise<void>,
) => {
  const [editingTitle, setEditingTitle] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const toggleEditingTitle = (id: string, title: string) => {
    if (id === editingId) {
      cancelEdit();
    } else {
      setEditingId(id);
      setEditingTitle(title);
    }
  };

  const confirmEdit = () => {
    const updatedConversation = conversations.find((conv: ConversationType) => conv.id === editingId);
    if (updatedConversation) {
      updatedConversation.title = editingTitle;
      setConversations((prev: ConversationType[]) => prev.map((conv: ConversationType) =>
        conv.id === editingId ? updatedConversation : conv
      ));
      handleUpdateConversations(updatedConversation);
      cancelEdit();
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  return {
    editingTitle,
    setEditingTitle,
    editingId,
    toggleEditingTitle,
    confirmEdit,
    cancelEdit
  };
};

export default useSidebar;