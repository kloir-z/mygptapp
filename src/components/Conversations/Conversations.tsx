import React, { useEffect, useState, useContext } from 'react';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { AuthContext } from '../Auth/AuthContext';
import Conversation from './Conversation';
import { ConversationWrapper, Placeholder } from './Conversations.styles'
import { ConversationType } from './Conversations.types';
import { fetchConversations, updateConversations  } from '../Auth/firebase';
import Sidebar from './Sidebar';

const Conversations: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    // handle the case when authContext is not available
    // for example, return null or some placeholder
    return null;
  }

  const { user } = authContext;
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationType | null>(null);
  const [showMenu, setShowMenu] = useState(true);

  useEffect(() => {
    const fetchUserConversations = async () => {
      const fetchedConversations = await fetchConversations(user?.uid);
      const conversations: ConversationType[] = fetchedConversations.map((message: any) => ({id: message.id, ...message} as ConversationType));
      setConversations(conversations);
      console.log(conversations);
    };

    fetchUserConversations();
  }, [user?.uid]);

  const handleMessageSend = async (updatedConversation: ConversationType) => {
    const updatedConversations = conversations.map(item => 
      item.id === updatedConversation.id ? updatedConversation : item
    );

    await updateConversations(user?.uid, updatedConversations);
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
      setActiveConversation(conversations[newIndex]);
    }
  };

  const toggleMenu = () => {
    setShowMenu(prevState => !prevState);
  };

  return (
    <ConversationWrapper>
    {showMenu && (
    <Sidebar
      conversations={conversations}
      activeConversation={activeConversation}
      setConversations={setConversations}
      setActiveConversation={setActiveConversation}
      handleKeyDown={handleKeyDown}
    />
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
