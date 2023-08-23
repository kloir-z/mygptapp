import React, { useMemo, useRef } from 'react';
import { StyledInput, ConversationItem, TitleLeft, TitleRight } from './styles/Sidebar.styles';
import { ConversationType } from './types/Conversations.types';
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { MdOutlineChat } from 'react-icons/md';
import useSidebar from 'src/hooks/useSidebar';

type SidebarProps = {
  conversations: ConversationType[];
  activeConversation: ConversationType | null;
  setConversations: Function;
  setActiveConversation: Function;
  handleUpdateConversations: (updatedConversation: ConversationType) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
};

const Sidebar: React.FC<SidebarProps> = ({ conversations, activeConversation, setConversations, setActiveConversation, handleUpdateConversations, deleteConversation }) => {
  const inputRef = useRef<HTMLInputElement>(null);  
  const {
    editingTitle,
    setEditingTitle,
    editingId,
    toggleEditingTitle,
    confirmEdit,
    cancelEdit,
    handleDeleteConversation,
  } = useSidebar(conversations, setConversations, handleUpdateConversations, deleteConversation);

  const reversedConversations = useMemo(() => {
    return [...conversations].reverse();
  }, [conversations]);

  return (
    <>
      {reversedConversations.map((conversation, index) => (
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
                <FaCheck className="Icon" style={{color:'rgb(0, 203, 105)'}} onClick={confirmEdit} />
                <FaTimes className="Icon" style={{color:'red'}} onClick={cancelEdit} />
                <FaTrash className="Icon" style={{color:'#404040'}} onClick={() => handleDeleteConversation(conversation.id)} />
              </TitleRight>
            </>
          ) : (
            <TitleLeft><MdOutlineChat /><span> {conversation.title}</span></TitleLeft>
          )}
        </ConversationItem>
      ))}
    </>
  );
};

export default Sidebar;