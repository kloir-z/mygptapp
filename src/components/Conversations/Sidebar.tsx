import React, { useState, useRef } from 'react';
import { StyledInput, ConversationItem, SidebarContainer, TitleLeft, TitleRight } from './Sidebar.styles';
import { ConversationType } from './Conversations.types';
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

type SidebarProps = {
  conversations: ConversationType[];
  activeConversation: ConversationType | null;
  setConversations: Function;
  setActiveConversation: Function;
};

const Sidebar: React.FC<SidebarProps> = ({ conversations, activeConversation, setConversations, setActiveConversation }) => {
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
    setConversations((prev: ConversationType[]) => prev.map((conv: ConversationType) => 
      conv.id === editingId ? {...conv, title: editingTitle} : conv
    ));
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const handleDeleteConversation = (id: string) => {
    if (window.confirm('Are You Sure to Delete?')) {
      setConversations((prev: ConversationType[]) => prev.filter((conv: ConversationType) => conv.id !== id));
    }
  };

  return (
    <SidebarContainer tabIndex={0}>
      {conversations.map((conversation, index) => (
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
                <FaCheck className="Icon" onClick={confirmEdit} />
                <FaTimes className="Icon" onClick={cancelEdit} />
                <FaTrash className="Icon" onClick={() => handleDeleteConversation(conversation.id)} />
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