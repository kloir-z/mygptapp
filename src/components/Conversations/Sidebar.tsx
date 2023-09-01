//Sidebar.tsx
import React, { useMemo, useRef, useEffect } from 'react';
import { StyledInput, ConversationItem, StyledButton, TitleLeft, TitleRight } from './styles/Sidebar.styles';
import { ConversationType } from './types/Conversations.types';
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { MdOutlineChat } from 'react-icons/md';
import useSidebar from 'src/hooks/useSidebar';
import { FaPlus } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid'; 

type SidebarProps = {
  conversations: ConversationType[];
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[]>>;
  activeConversation: ConversationType | null;
  setActiveConversation: React.Dispatch<React.SetStateAction<ConversationType | null>>;
  handleUpdateConversations: (updatedConversation: ConversationType) => Promise<void>;
  handleDeleteConversation: (id: string) => Promise<void>;
};

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

const Sidebar: React.FC<SidebarProps> = ({ conversations, setConversations, activeConversation, setActiveConversation, handleUpdateConversations, handleDeleteConversation }) => {
  const inputRef = useRef<HTMLInputElement>(null);  
  const {
    editingTitle,
    setEditingTitle,
    editingId,
    toggleEditingTitle,
    confirmEdit,
    cancelEdit,
  } = useSidebar(conversations, setConversations, handleUpdateConversations);

  useEffect(() => {
    // タイトルが"New Conversation"で、roleが"assistant"のメッセージが含まれていないconversationを探す
    const newConversationNeeded = !conversations.some(conversation => {
      return conversation.title === "New Conversation" && 
        !conversation.revisions.some(revision => 
          revision.conversation.some(message => message.role === "assistant")
        );
    });

    // そのようなconversationが存在しなければ、新しいものを追加する
    if (newConversationNeeded) {
      const newConv = createNewConversation();
      setConversations(prev => [...prev, newConv]);
    }

  }, [conversations, setConversations]); 

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