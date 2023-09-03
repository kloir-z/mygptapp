//App.tsx
import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from '../Auth/AuthContext';
import { getAuth } from 'firebase/auth';
import { ConversationType, SystemPromptType, ConversationData } from '../Conversations/types/Conversations.types';
import { fetchUserData, updateConversations, deleteConversation } from '../Auth/firebase';
import { LoginContainer, ScrollWrapper, MainContainer, SidebarContainer } from './App.styles'
import Topbar from '../Conversations/Topbar'
import Sidebar from '../Conversations/Sidebar'
import Conversation from '../Conversations/Conversation'
import SidebarResizer from '../Conversations/SidebarResizer';
import GoogleButton from "../Conversations/GoogleButton";
import SpinnerFull from "../Conversations/SpinnerFull";

const App: React.FC = () => {
  const { user, isLoading, handleLogin } = useContext(AuthContext);
  const auth = getAuth();
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
  const [inputMessage, setInputMessage] = useState('');

  const minSidebarWidth = 15;
  const maxSidebarWidth = 600;
  const scrollWrapperRef = useRef(null);

  const handleUpdateConversations = async (updatedConversation: ConversationType, shouldUpdateFirestore: boolean = true) => {
    const updatedConversations = conversations.map(Conversation => 
      Conversation.id === updatedConversation.id ? updatedConversation : Conversation
    );
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

  useEffect(() => {
    const updatedActiveConversation = conversations.find(conv => conv.id === activeConversation?.id);
    
    if (updatedActiveConversation) { 
      setActiveConversation(updatedActiveConversation);
    } else if (!conversations.some(conv => conv.id === activeConversation?.id)) {
      setActiveConversation(null);
    }
  }, [conversations]);

  useEffect(() => {
    if (activeConversation === null && conversations.length > 0) {
      const lastConversation = conversations[conversations.length - 1];
      setActiveConversation(lastConversation);
    }
  }, [conversations, activeConversation]);

  const handleDeleteConversation = async (id: string) => {
    if (window.confirm('Are You Sure to Delete?')) {
      await deleteConversation(user?.uid, id);
      setConversations(conversations.filter(conv => conv.id !== id));
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
    return isLoading ? <SpinnerFull /> : (
      <LoginContainer>
        <GoogleButton isSignedIn={false} onClick={handleLogin} />
      </LoginContainer>
    );
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
        inputMessage={inputMessage}
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
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
          />
        ) : (
          <></>
        )}
      </MainContainer>
    </ScrollWrapper>
  );
}

export default App;
