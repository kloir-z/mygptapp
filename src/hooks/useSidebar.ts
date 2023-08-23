import { useState } from 'react';
import { ConversationType } from 'src/components/Conversations/types/Conversations.types';

const useSidebar = (
  conversations: ConversationType[],
  setConversations: Function,
  handleUpdateConversations: (updatedConversation: ConversationType) => Promise<void>,
  deleteConversation: (id: string) => Promise<void>
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

  const handleDeleteConversation = (id: string) => {
    if (window.confirm('Are You Sure to Delete?')) {
      deleteConversation(id).then(() => {
        setConversations((prev: ConversationType[]) => prev.filter((conv: ConversationType) => conv.id !== id));
      });
    }
  };

  return {
    editingTitle,
    setEditingTitle,
    editingId,
    toggleEditingTitle,
    confirmEdit,
    cancelEdit,
    handleDeleteConversation,
  };
};

export default useSidebar;