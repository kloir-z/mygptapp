import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from '../Auth/AuthContext';
import { ConversationType, SystemPromptType } from '../Conversations/types/Conversations.types';
import { fetchConversations, updateConversations, deleteConversation } from '../Auth/firebase';
import { MainContainer, Placeholder } from './App.styles'
import Topbar from '../Conversations/Topbar'
import Sidebar from '../Conversations/Sidebar'
import Conversation from '../Conversations/Conversation'
import SidebarResizer from '../Conversations/SidebarResizer';

const App: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationType | null>(null);
  const [systemprompts, setSystemPrompts] = useState<SystemPromptType[]>([]);
  const [showMenu, setShowMenu] = useState(true);
  const [model, setModel] = useState('gpt-3.5-turbo-0613'); 
  const [apiKey, setApiKey] = useState('');
  const [receivingId, setReceivingId] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const minSidebarWidth = 15;
  const maxSidebarWidth = 600;

  const handleResize = (width: number) => {
    setSidebarWidth(width);
  };

  useEffect(() => {
    const fetchUserConversations = async () => {
      const result = await fetchConversations(user?.uid);
      if (Array.isArray(result)) return;
      const { messages, systemPrompts } = result;
      const conversations: ConversationType[] = messages.map((message: any) => ({id: message.id, ...message} as ConversationType));
      const systemprompts: SystemPromptType[] = systemPrompts.map((systemPrompt: any) => ({id: systemPrompt.id, ...systemPrompt} as SystemPromptType));
      setConversations(conversations);
      setSystemPrompts(systemprompts);
    };

    fetchUserConversations();
  }, [user?.uid]);

  const handleUpdateConversations = async (updatedConversation: ConversationType) => {
    const updatedConversations = conversations.map(item => 
      item.id === updatedConversation.id ? updatedConversation : item
    );

    await updateConversations(user?.uid, updatedConversations);
    setConversations(updatedConversations);
  };

  const handleDeleteConversation = async (id: string) => {
    await deleteConversation(user?.uid, id);
    setConversations(conversations.filter(conv => conv.id !== id));
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
        systemprompts={systemprompts}
        setSystemPrompts={setSystemPrompts}
      />
      <MainContainer>
        {showMenu && (
          <>
          <Sidebar
            conversations={conversations}
            activeConversation={activeConversation}
            setConversations={setConversations}
            setActiveConversation={setActiveConversation}
            handleUpdateConversations={handleUpdateConversations}
            deleteConversation={handleDeleteConversation}
            style={{ width: sidebarWidth, maxWidth: maxSidebarWidth }}
          />
          <SidebarResizer onResize={handleResize} sidebarWidth={sidebarWidth} minSidebarWidth={minSidebarWidth} maxSidebarWidth={maxSidebarWidth} />
          </>
          )}
          {activeConversation ? (
            <Conversation
              showMenu={showMenu}
              conversation={activeConversation}
              model={model}
              apiKey={apiKey}
              handleUpdateConversations={handleUpdateConversations}
              systemprompts={systemprompts}
              receivingId={receivingId}
              setReceivingId={setReceivingId}
            />
          ) : (
            <Placeholder>Please select a conversation</Placeholder>
          )}
      </MainContainer>
    </>
  );
}

export default App;
