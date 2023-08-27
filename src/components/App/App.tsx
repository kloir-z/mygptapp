//App.tsx
import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from '../Auth/AuthContext';
import { ConversationType, SystemPromptType, ConversationData } from '../Conversations/types/Conversations.types';
import { fetchUserData, updateConversations, deleteConversation } from '../Auth/firebase';
import { ScrollWrapper, MainContainer, SidebarContainer, Placeholder } from './App.styles'
import Topbar from '../Conversations/Topbar'
import Sidebar from '../Conversations/Sidebar'
import Conversation from '../Conversations/Conversation'
import SidebarResizer from '../Conversations/SidebarResizer';
import { Spinner } from "../Conversations/Spinner";

const App: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [systemprompts, setSystemPrompts] = useState<SystemPromptType[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationType | null>(null);
  const [receivingId, setReceivingId] = useState('');
  const [receivingMessage, setReceivingMessage] = useState<string>('');
  const [showMenu, setShowMenu] = useState(true);
  const [model, setModel] = useState('gpt-3.5-turbo-0613'); 
  const [apiKey, setApiKey] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const [sidebarTransition, setSidebarTransition] = useState(false)
  const [queuedMessageForReceivingId, setqueuedMessageForReceivingId] = useState<ConversationData | null>(null);
  const minSidebarWidth = 15;
  const maxSidebarWidth = 600;
  const scrollWrapperRef = useRef(null);

  const handleUpdateConversations = async (updatedConversation: ConversationType, shouldUpdateFirestore: boolean = true) => {
    const updatedConversations = conversations.map(Conversation => 
      Conversation.id === updatedConversation.id ? updatedConversation : Conversation
    );
    console.log('updated')
    setConversations(updatedConversations);
    
    if (shouldUpdateFirestore) {
      await updateConversations(user?.uid, updatedConversations);
    }
  };

  useEffect(() => {
    if (queuedMessageForReceivingId !== null) {
      const targetConversation = conversations.find(conv => conv.id === receivingId);
      if (targetConversation) {
        const targetRevision = targetConversation.revisions.find(rev => rev.revision === '0');
        if (targetRevision) {
          targetRevision.conversation.push(queuedMessageForReceivingId);
          handleUpdateConversations(targetConversation, queuedMessageForReceivingId.role !== 'user');
        }
      }
      setqueuedMessageForReceivingId(null);
    }
  }, [queuedMessageForReceivingId]);

  const replacer = (key: string, value: any) => {
    if (key === 'content' && typeof value === 'string' && value.length > 20) {
      return `${value.substring(0, 20)}...`;
    }
    return value;
  };

  useEffect(() => {
    const updatedActiveConversation = conversations.find(conv => conv.id === activeConversation?.id);
    
    console.log(JSON.stringify(conversations, replacer, 2));
    if (updatedActiveConversation) { 
      setActiveConversation(updatedActiveConversation);
    } else if (!conversations.some(conv => conv.id === activeConversation?.id)) {
      setActiveConversation(null);
    }
  }, [conversations]);

  const handleDeleteConversation = async (id: string) => {
    if (window.confirm('Are You Sure to Delete?')) {
      await deleteConversation(user?.uid, id);
      setConversations(conversations.filter(conv => conv.id !== id));
      console.log('deleted')
      console.log(JSON.stringify(conversations, replacer, 2));
    }
  };

  const handleResize = (width: number) => {
    setSidebarWidth(width);
  };

  useEffect(() => {
    const getUserData = async () => {
      const fetchedData = await fetchUserData(user?.uid);
      setConversations(fetchedData.conversations);
      setSystemPrompts(fetchedData.systemPrompts);
    };
  
    getUserData();
  }, [user?.uid]);

  if (!user) {
    return <div style={{padding: '30px'}}><Spinner/></div>;
  }

  return (
    <ScrollWrapper ref={scrollWrapperRef}>
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
        setSidebarTransition={setSidebarTransition}
        
      />
      <MainContainer>
        <SidebarContainer showMenu={showMenu} sidebarWidth={sidebarWidth} sidebarTransition={sidebarTransition} tabIndex={0}>
          <Sidebar
            conversations={conversations}
            activeConversation={activeConversation}
            setConversations={setConversations}
            setActiveConversation={setActiveConversation}
            handleUpdateConversations={handleUpdateConversations}
            handleDeleteConversation={handleDeleteConversation}
            receivingId={receivingId}
          />
        </SidebarContainer>
        {showMenu && (
        <SidebarResizer onResize={handleResize} sidebarWidth={sidebarWidth} minSidebarWidth={minSidebarWidth} maxSidebarWidth={maxSidebarWidth} />
        )}
        {activeConversation ? (
          <Conversation
            activeConversation={activeConversation}
            model={model}
            apiKey={apiKey}
            handleUpdateConversations={handleUpdateConversations}
            systemprompts={systemprompts}
            receivingId={receivingId}
            setReceivingId={setReceivingId}
            receivingMessage={receivingMessage}
            setReceivingMessage={setReceivingMessage}
            scrollWrapperRef={scrollWrapperRef}
            setqueuedMessageForReceivingId={setqueuedMessageForReceivingId}
          />
        ) : (
          <Placeholder>Please select a conversation</Placeholder>
        )}
      </MainContainer>
    </ScrollWrapper>
  );
}

export default App;
