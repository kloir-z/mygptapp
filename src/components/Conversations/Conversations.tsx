import React, { useEffect, useState, useContext, useRef } from 'react';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { AuthContext } from '../Auth/AuthContext';
import Conversation from './Conversation';
import { v4 as uuidv4 } from 'uuid'; 
import { FiEdit2 } from 'react-icons/fi';
import { ConversationWrapper,Sidebar,ConversationItem,StyledButton,StyledInput,Placeholder } from './Conversations.styles'

export type ConversationData = {
  role: string;
  content: string;
};

type RevisionData = {
  revision: string;
  conversation: ConversationData[];
};

export type Conversation = {
  id: string;
  title: string;
  revisions: RevisionData[];
};

const Conversations: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    // handle the case when authContext is not available
    // for example, return null or some placeholder
    return null;
  }

  const { user } = authContext;
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [editingTitles, setEditingTitles] = useState<Record<string, boolean>>({});
  const inputRef = useRef<HTMLInputElement>(null);  
  const [originalTitle, setOriginalTitle] = useState<string>("");
  const [showMenu, setShowMenu] = useState(true);

  const toggleMenu = () => {
    setShowMenu(prevState => !prevState);
  };

  useEffect(() => {
    const fetchConversations = async () => {
      const firestore = firebase.firestore();
      const docRef = firestore.collection("conversations").doc(user?.uid);
      const doc = await docRef.get();
      const data = doc.data();
      if (!data || !data.messages) {
        return;
      }
      const conversations: Conversation[] = data.messages.map((message: any) => ({id: message.id, ...message} as Conversation));
      setConversations(conversations);
      console.log(conversations);
    };

    fetchConversations();
  }, [user?.uid]);

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
          setConversations(prev => prev.map(conv => 
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

  const createNewConversation = (): Conversation => {
    return {
      id: uuidv4(),
      title: "New Conversation",
      revisions: [
        {
          revision: "0",
          conversation: [
          ],
        },
      ],
    };
  };
  
  const handleMessageSend = async (updatedConversation: Conversation) => {
    const updatedConversations = conversations.map(item => 
      item.id === updatedConversation.id ? updatedConversation : item
    );

    const firestore = firebase.firestore();
    await firestore.collection("conversations").doc(user?.uid).set({
      messages: updatedConversations
    });

    setConversations(updatedConversations);
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
      changeConversation(newIndex);
    }
  };

  const toggleEditingTitle = (id: string) => {
    setEditingTitles(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

   return (
    <ConversationWrapper>
    {showMenu && (
    <Sidebar
      tabIndex={0}
      onKeyDown={(e) => handleKeyDown(e)}
    >
        <StyledButton onClick={() => {
          const newConv = createNewConversation();
          setConversations(prev => [...prev, newConv]);
          setActiveConversation(newConv);
        }}>New</StyledButton>
        <StyledButton onClick={() => {
          if(activeConversation) {
            setConversations(prev => prev.filter(conv => conv.id !== activeConversation.id));
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
                  setConversations(prev => prev.map(conv => 
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
      </Sidebar>
      )}
      {activeConversation ? (
        <Conversation
          conversation={activeConversation}
          setConversations={setConversations}
          setActiveConversation={setActiveConversation}
          sendMessage={handleMessageSend}
          toggleMenu={toggleMenu}
        />
      ) : (
        <Placeholder>Please select a conversation</Placeholder>
      )}
    </ConversationWrapper>
  );
};

export default Conversations;