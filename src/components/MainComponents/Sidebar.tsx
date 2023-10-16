//Sidebar.tsx
import React, { useMemo, useEffect } from 'react';
import { StyledInput, ConversationItem, TitleContainer, TitleEditIconsContainer, IconButton } from '../../styles/Sidebar.styles';
import { ConversationType } from '../../types/Conversations.types';
import { FaTrash, FaCheck, FaTimes, FaYoutube } from 'react-icons/fa';
import { RiArticleLine, RiSpeakLine, RiTranslate2 } from 'react-icons/ri'
import { MdOutlineChat, MdDocumentScanner } from 'react-icons/md';
import useSidebar from 'src/hooks/useSidebar';
import { v4 as uuidv4 } from 'uuid'; 

type SidebarProps = {
  conversations: ConversationType[];
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[]>>;
  activeConversation: ConversationType | null;
  setActiveConversation: React.Dispatch<React.SetStateAction<ConversationType | null>>;
  handleUpdateConversations: (updatedConversation: ConversationType) => Promise<void>;
  handleDeleteConversation: (id: string) => Promise<void>;
  setIsConversationLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const createNewConversation = (): ConversationType => {
  return {
    id: uuidv4(),
    title: "New Conversation",
    systemPromptTitle: "",
    revisions: [
      {
        revision: "0",
        conversation: [],
      },
    ],
  };
};


const Sidebar: React.FC<SidebarProps> = ({ conversations, setConversations, activeConversation, setActiveConversation, handleUpdateConversations, handleDeleteConversation, setIsConversationLoading }) => {
  const {
    editingTitle,
    setEditingTitle,
    editingId,
    toggleEditingTitle,
    confirmEdit,
    cancelEdit,
  } = useSidebar(conversations, setConversations, handleUpdateConversations);

  useEffect(() => {
    // Find all conversations titled "New Conversation" with no messages
    const emptyNewConversations = conversations.filter(conversation => {
      return conversation.title === "New Conversation" && 
        !conversation.revisions.some(revision => 
          revision.conversation.length > 0
        );
    });
  
    // If such conversations exist and there are more than one, delete them
    if (emptyNewConversations.length > 1) {
      const newConversations = conversations.filter(conversation => {
        return !emptyNewConversations.includes(conversation);
      });
      setConversations(newConversations);
      return;
    }
  
    // If only one exists and it's not the last one, move it to the end
    if (emptyNewConversations.length === 1) {
      const targetIndex = conversations.indexOf(emptyNewConversations[0]);
      if (targetIndex < conversations.length - 1) {
        const newConversations = [...conversations];
        const [targetConversation] = newConversations.splice(targetIndex, 1);
        newConversations.push(targetConversation);
        setConversations(newConversations);
      }
    }
  
    // If no such conversations exist, add a new one
    if (emptyNewConversations.length === 0) {
      const newConv = createNewConversation();
      setConversations(prev => [...prev, newConv]);
      setActiveConversation(newConv);
    }
  
  }, [conversations, setConversations]);

  type IconMapType = {
    [key: string]: React.ComponentType;
  };

  const iconMap: IconMapType = {
    'Youtube Summary': FaYoutube,
    'Web Page Summary': RiArticleLine,
    'VoiceMode': RiSpeakLine,
    'Translation': RiTranslate2,
    'OCR and Summary': MdDocumentScanner,
  };
    
  const getIconForSystemPromptTitle = (systemPromptTitle: string) => {
    const IconComponent = iconMap[systemPromptTitle];
    return IconComponent ? <IconComponent /> : <MdOutlineChat />;
  };

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
              setIsConversationLoading(true);
              cancelEdit();
            }
          }}
          onDoubleClick={(e) => {e.preventDefault(); editingId !== conversation.id && toggleEditingTitle(conversation.id, conversation.title)}}
          active={activeConversation?.id === conversation.id}
        >
          {editingId === conversation.id ? (
            <>
              <StyledInput 
                value={editingTitle} 
                onChange={(e) => setEditingTitle(e.target.value)}
              />
              <TitleEditIconsContainer>
                <IconButton onClick={confirmEdit}><FaCheck style={{color:'rgb(41, 175, 0)'}} /></IconButton>
                <IconButton onClick={cancelEdit}><FaTimes style={{color:'red'}} /></IconButton>
                <IconButton onClick={() => handleDeleteConversation(conversation.id)}><FaTrash style={{color:'#404040'}} /></IconButton>
              </TitleEditIconsContainer>
            </>
          ) : (
            <TitleContainer>
              {getIconForSystemPromptTitle(conversation.systemPromptTitle)}
              <span> {conversation.title}</span>
            </TitleContainer>
          )}
        </ConversationItem>
      ))}
    </>
  );
};

export default Sidebar;