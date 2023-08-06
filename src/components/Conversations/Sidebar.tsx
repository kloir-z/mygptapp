import React, { useState, useRef, useEffect } from 'react';
import { StyledInput, ConversationItem, SidebarContainer, TitleLeft, TitleRight } from './Sidebar.styles';
import { ConversationType } from './Conversations.types';
import { FiEdit2 } from 'react-icons/fi';
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { handleClickOutside, handleEscape, handleKeyDown } from './sidebarHandlers';

type SidebarProps = {
  conversations: ConversationType[];
  activeConversation: ConversationType | null;
  setConversations: Function;
  setActiveConversation: Function;
};

const Sidebar: React.FC<SidebarProps> = ({ conversations, activeConversation, setConversations, setActiveConversation }) => {
  const inputRef = useRef<HTMLInputElement>(null);  
  const [originalTitle, setOriginalTitle] = useState<string>("");
  const [editingTitles, setEditingTitles] = useState<Record<string, boolean>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isDeleting = (id: string) => deletingId === id;

  const setDeletingConversation = (id: string) => {
    setDeletingId(id);
  };

  const cancelDeletion = () => {
    setDeletingId(null);
  };

  const confirmDeletion = () => {
    setConversations((prev: ConversationType[]) => prev.filter((conv: ConversationType) => conv.id !== deletingId));
    setDeletingId(null);
  };
  
  useEffect(() => {
    const boundHandleClickOutside = handleClickOutside(inputRef, editingTitles, toggleEditingTitle);
    document.addEventListener('mousedown', boundHandleClickOutside);
    return () => {
      document.removeEventListener('mousedown', boundHandleClickOutside);
    };
  }, [editingTitles]);

  useEffect(() => {
    const boundHandleEscape = handleEscape(editingTitles, originalTitle, setConversations, toggleEditingTitle);
    document.addEventListener("keydown", boundHandleEscape);
    return () => {
      document.removeEventListener("keydown", boundHandleEscape);
    };
  }, [editingTitles, originalTitle]);
  
  const changeConversation = (index: number) => {
    if (Object.values(editingTitles).some(isEditing => isEditing)) {
      return;
    }
    setActiveConversation(conversations[index]);
  };

  const toggleEditingTitle = (id: string) => {
    setEditingTitles(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <SidebarContainer tabIndex={0} onKeyDown={handleKeyDown(activeConversation, conversations, setActiveConversation)}>
        {conversations.map((conversation, index) => (
        <ConversationItem 
          key={index} 
          onClick={() => changeConversation(index)}
          active={activeConversation?.id === conversation.id}
        >
          {editingTitles[conversation.id] ? (
            <StyledInput 
              ref={inputRef}
              value={conversation.title} 
              onChange={(e) => {
                const newTitle = e.target.value;
                setConversations((prev: ConversationType[]) => prev.map((conv: ConversationType) => 
                  conv.id === conversation.id ? {...conv, title: newTitle} : conv
                ));
              }}
            />
          ) : (
            <>
              <TitleLeft>{conversation.title}</TitleLeft>
              {isDeleting(conversation.id) ? (
                <TitleRight>
                  <FaCheck 
                    className="EditIcon"
                    onClick={(event) => {
                      event.stopPropagation();
                      confirmDeletion();
                    }} 
                  />
                  <FaTimes 
                    className="EditIcon"
                    onClick={(event) => {
                      event.stopPropagation();
                      cancelDeletion();
                    }} 
                  />
                </TitleRight>
              ) : (
                <TitleRight>
                  <FiEdit2 
                    className="EditIcon"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleEditingTitle(conversation.id);
                      setOriginalTitle(conversation.title);
                    }} 
                  />
                  <FaTrash 
                    className="EditIcon"
                    onClick={(event) => {
                      event.stopPropagation();
                      setDeletingConversation(conversation.id);
                    }} 
                  />
                </TitleRight>
              )}
            </>
          )}
        </ConversationItem>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;