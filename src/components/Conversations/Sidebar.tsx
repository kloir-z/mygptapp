import React, { useState, useRef, useEffect } from 'react';
import { StyledButton, StyledInput, ConversationItem, SidebarContainer, TitleLeft, TitleRight } from './Sidebar.styles';
import { ConversationType } from './Conversations.types';
import { FiEdit2 } from 'react-icons/fi';
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

type SidebarProps = {
  conversations: ConversationType[];
  activeConversation: ConversationType | null;
  setConversations: Function;
  setActiveConversation: Function;
};

const Sidebar: React.FC<SidebarProps> = ({ conversations, activeConversation, setConversations, setActiveConversation }) => {
  const [editingTitles, setEditingTitles] = useState<Record<string, boolean>>({});
  const inputRef = useRef<HTMLInputElement>(null);  
  const [originalTitle, setOriginalTitle] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isDeleting = (id: string) => deletingId === id;

  const setDeletingConversation = (id: string) => {
    setDeletingId(id);
  };

  const confirmDeletion = () => {
    setConversations((prev: ConversationType[]) => prev.filter((conv: ConversationType) => conv.id !== deletingId));
    setDeletingId(null);  // Reset the deletingId
  };

  const cancelDeletion = () => {
    setDeletingId(null);  // Reset the deletingId
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        const id = Object.keys(editingTitles).find(key => editingTitles[key]);
        if (id) {
          toggleEditingTitle(id);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingTitles]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const id = Object.keys(editingTitles).find(key => editingTitles[key]);
        if (id) {
          setConversations((prev: ConversationType[]) => prev.map(conv => 
            conv.id === id ? {...conv, title: originalTitle} : conv
          ));
          toggleEditingTitle(id);
        }
      }
    };
  
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let newIndex;
    if (activeConversation) {
      const currentIndex = conversations.findIndex(
        (conv) => conv.id === activeConversation.id
      );
      if (e.keyCode === 38 && currentIndex > 0) { // Up key
        newIndex = currentIndex - 1;
      } else if (e.keyCode === 40 && currentIndex < conversations.length - 1) { // Down key
        newIndex = currentIndex + 1;
      }
    } else if (e.keyCode === 38 || e.keyCode === 40) { // If no conversation selected yet
      newIndex = 0;
    }
    if (newIndex !== undefined) {
      setActiveConversation(conversations[newIndex]);
    }
  };

  return (
    <SidebarContainer tabIndex={0} onKeyDown={(e) => handleKeyDown(e)}>
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
                    className="confirm-icon"
                    onClick={(event) => {
                      event.stopPropagation();
                      confirmDeletion();
                    }} 
                  />
                  <FaTimes 
                    className="cancel-icon"
                    onClick={(event) => {
                      event.stopPropagation();
                      cancelDeletion();
                    }} 
                  />
                </TitleRight>
              ) : (
                <TitleRight>
                  <FiEdit2 
                    className="edit-icon"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleEditingTitle(conversation.id);
                      setOriginalTitle(conversation.title);
                    }} 
                  />
                  <FaTrash 
                    className="delete-icon"
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