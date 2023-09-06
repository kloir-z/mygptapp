//Sidebar.tsx
import React, { useMemo, useRef, useEffect } from 'react';
import { StyledInput, ConversationItem, StyledButton, TitleLeft, TitleRight } from '../styles/Sidebar.styles';
import { ConversationType } from '../types/Conversations.types';
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { MdOutlineChat } from 'react-icons/md';
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
    // タイトルが"New Conversation"で、メッセージが含まれていないconversationを全て見つける
    const emptyNewConversations = conversations.filter(conversation => {
      return conversation.title === "New Conversation" && 
        !conversation.revisions.some(revision => 
          revision.conversation.length > 0
        );
    });
  
    // そのようなconversationが存在し、それが複数あれば、それを削除する
    if (emptyNewConversations.length > 1) {
      const newConversations = conversations.filter(conversation => {
        return !emptyNewConversations.includes(conversation);
      });
      setConversations(newConversations);
      return;
    }
  
    // １つだけ存在する場合、それが最後でなければ、最後に移動する
    if (emptyNewConversations.length === 1) {
      const targetIndex = conversations.indexOf(emptyNewConversations[0]);
      if (targetIndex < conversations.length - 1) {
        const newConversations = [...conversations];
        const [targetConversation] = newConversations.splice(targetIndex, 1);
        newConversations.push(targetConversation);
        setConversations(newConversations);
      }
    }
  
    // そのようなconversationが存在しなければ、新しいものを追加する
    if (emptyNewConversations.length === 0) {
      const newConv = createNewConversation();
      setConversations(prev => [...prev, newConv]);
      setActiveConversation(newConv);
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
              setIsConversationLoading(true);
              cancelEdit();
            }
          }}
          onDoubleClick={() => editingId !== conversation.id && toggleEditingTitle(conversation.id, conversation.title)}
          active={activeConversation?.id === conversation.id}
        >
          {editingId === conversation.id ? (
            <>
              <StyledInput 
                value={editingTitle} 
                onChange={(e) => setEditingTitle(e.target.value)}
              />
              <TitleRight>
                <FaCheck className="Icon" style={{color:'rgb(41, 175, 0)'}} onClick={confirmEdit} />
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