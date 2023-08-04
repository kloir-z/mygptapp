import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from '../Auth/AuthContext';
import { ConversationType } from '../Conversations/Conversations.types';
import { fetchConversations, updateConversations  } from '../Auth/firebase';
import { MainContainer, Placeholder, SidebarWrapper  } from './App.styles'
import Topbar from '../Conversations/Topbar'
import Sidebar from '../Conversations/Sidebar'
import Conversation from '../Conversations/Conversation'
import { useSwipeable } from 'react-swipeable';
import { CSSTransition } from 'react-transition-group';

const App: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationType | null>(null);
  const [showMenu, setShowMenu] = useState(true);
  const [model, setModel] = useState('gpt-3.5-turbo-0613'); 
  const [apiKey, setApiKey] = useState('');

  const handlers = useSwipeable({
    onSwipedLeft: () => setShowMenu(false)
  });

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

  if (!user) {
    return <>loading...</>;
  }

  return (
    <>
      <Topbar
        conversations={conversations}
        model={model}
        setModel={setModel}
        apiKey={apiKey}
        setApiKey={setApiKey}
        activeConversation={activeConversation}
        setConversations={setConversations}
        setActiveConversation={setActiveConversation}
        setShowMenu={setShowMenu}
      />
      <MainContainer>
        {showMenu && (
        <SidebarWrapper open={showMenu} {...handlers}>
          <Sidebar
            conversations={conversations}
            activeConversation={activeConversation}
            setConversations={setConversations}
            setActiveConversation={setActiveConversation}
          />
          </SidebarWrapper>
        )}
        <div {...handlers}>
          {activeConversation ? (
            <Conversation
              conversation={activeConversation}
              model={model}
              apiKey={apiKey}
              sendMessage={handleMessageSend}
            />
          ) : (
            <Placeholder>Please select a conversation</Placeholder>
          )}
        </div>
      </MainContainer>
    </>
  );
}

export default App;