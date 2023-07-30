import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; 
import { StyledButton, StyledInput, ConversationItem, StyledSidebarDiv } from './Conversations.styles';
import { ConversationType } from './Conversations.types';
import { FiEdit2 } from 'react-icons/fi';

type SidebarProps = {
  conversations: ConversationType[];
  activeConversation: ConversationType | null;
  setConversations: Function;
  setActiveConversation: Function;
  handleKeyDown: Function;
};

const Sidebar: React.FC<SidebarProps> = ({ conversations, activeConversation, setConversations, setActiveConversation, handleKeyDown }) => {
  const [editingTitles, setEditingTitles] = useState<Record<string, boolean>>({});
  const inputRef = useRef<HTMLInputElement>(null);  
  const [originalTitle, setOriginalTitle] = useState<string>("");
  
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

  const createNewConversation = (): ConversationType => {
    return {
      id: uuidv4(),
      title: "New Conversation",
      revisions: [
        {
          revision: "0",
          conversation: [],
        },
      ],
    };
  };

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
    <StyledSidebarDiv
      tabIndex={0}
      onKeyDown={(e) => handleKeyDown(e)}
    >
        <StyledButton onClick={() => {
        const newConv = createNewConversation();
        setConversations((prev: ConversationType[]) => [...prev, newConv]);
        setActiveConversation(newConv);
        }}>New</StyledButton>

        <StyledButton onClick={() => {
        if(activeConversation) {
            setConversations((prev: ConversationType[]) => prev.filter((conv: ConversationType) => conv.id !== activeConversation.id));
            setActiveConversation(null);
        }
        }}>Delete</StyledButton>

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
            {conversation.title}
            <FiEdit2 
              className="edit-icon"
              onClick={(event) => {
                event.stopPropagation();
                toggleEditingTitle(conversation.id);
                setOriginalTitle(conversation.title);
              }} 
            />
            </>
          )}
        </ConversationItem>
      ))}
    </StyledSidebarDiv>
  );
};

export default Sidebar;