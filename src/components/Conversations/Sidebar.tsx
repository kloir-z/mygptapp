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
  const [editingTitle, setEditingTitle] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const confirmEdit = () => {
    setConversations((prev: ConversationType[]) => prev.map((conv: ConversationType) => 
      conv.id === editingId ? {...conv, title: editingTitle} : conv
    ));
    setEditingId(null);
    setEditingTitle("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

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

  const toggleEditingTitle = (id: string, title: string) => {
    if (id === editingId) {
      cancelEdit();
    } else {
      setEditingId(id);
      setEditingTitle(title);
    }
  };

  return (
    <SidebarContainer tabIndex={0}>
        {conversations.map((conversation, index) => (
        <ConversationItem 
          key={index} 
          onClick={() => setActiveConversation(conversation)}
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
                <FaCheck 
                  className="EditIcon"
                  onClick={(event) => {
                    event.stopPropagation();
                    confirmEdit();
                  }} 
                />
                <FaTimes 
                  className="EditIcon"
                  onClick={(event) => {
                    event.stopPropagation();
                    cancelEdit();
                  }} 
                />
              </TitleRight>
            </>
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
                      toggleEditingTitle(conversation.id, conversation.title);
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