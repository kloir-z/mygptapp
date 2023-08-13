import React, { useState, useRef } from 'react';
import { StyledInput, ConversationItem, SidebarContainer, TitleLeft, TitleRight } from './styles/Sidebar.styles';
import { ConversationType } from './types/Conversations.types';
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

type SidebarProps = {
  conversations: ConversationType[];
  activeConversation: ConversationType | null;
  setConversations: Function;
  setActiveConversation: Function;
  sendMessage: (updatedConversation: ConversationType) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
};

const Sidebar: React.FC<SidebarProps> = ({ conversations, activeConversation, setConversations, setActiveConversation, sendMessage, deleteConversation }) => {
  const inputRef = useRef<HTMLInputElement>(null);  
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
      sendMessage(updatedConversation);
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

  return (
    <SidebarContainer tabIndex={0}>
      {[...conversations].reverse().map((conversation, index) => (
        <ConversationItem 
          key={index} 
          onClick={() => {
            if (activeConversation?.id !== conversation.id) {
              setActiveConversation(conversation);
              cancelEdit();
            }
          }}
          onDoubleClick={() => editingId !== conversation.id && toggleEditingTitle(conversation.id, conversation.title)}
          active={activeConversation?.id === conversation.id}
        >
          {editingId === conversation.id ? (
            <>
              <StyledInput 
                ref={inputRef}
                value={editingTitle} 
                onChange={(e) => setEditingTitle(e.target.value)}
              />
              <TitleRight>
                <FaCheck className="Icon" style={{color:'green'}} onClick={confirmEdit} />
                <FaTimes className="Icon" style={{color:'red'}} onClick={cancelEdit} />
                <FaTrash className="Icon" style={{color:'#404040'}} onClick={() => handleDeleteConversation(conversation.id)} />
              </TitleRight>
            </>
          ) : (
            <TitleLeft>{conversation.title}</TitleLeft>
          )}
        </ConversationItem>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;