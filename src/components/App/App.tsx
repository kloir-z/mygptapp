//App.tsx
import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from '../Auth/AuthContext';
import { ConversationType, SystemPromptType, ConversationData } from '../../types/Conversations.types';
import { fetchUserData, updateConversations, deleteConversation } from '../Auth/firebase';
import { LoginContainer, ScrollWrapper, MainContainer, SidebarContainer } from '../../styles/App.styles'
import Topbar from '../MainComponents/Topbar'
import Sidebar from '../MainComponents/Sidebar'
import Conversation from '../MainComponents/Conversation'
import SidebarResizer from '../Parts/SidebarResizer';
import GoogleButton from "../Parts/GoogleButton";
import SpinnerFull from "../Parts/SpinnerFull";
import { generateConversationTitle } from "src/utils/openAIUtil"

const App: React.FC = () => {
  const { user, isLoading, handleLogin } = useContext(AuthContext);
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
  const [queuedMessageForReceivingId, setQueuedMessageForReceivingId] = useState<ConversationData | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isConversationLoading, setIsConversationLoading] = useState(false);
  const [gcpApiKey, setGcpApiKey] = useState<string>("");

  const minSidebarWidth = 15;
  const maxSidebarWidth = 1500;
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
      setQueuedMessageForReceivingId(null);
    }
  }, [queuedMessageForReceivingId]);

  useEffect(() => {
    const updatedActiveConversation = conversations.find(conv => conv.id === activeConversation?.id);
    
    // activeConversation のタイトルが "New Conversation" であり、assistant のメッセージが含まれているかチェック
    if (updatedActiveConversation && updatedActiveConversation.title === 'New Conversation') {
      const hasAssistantMessage = updatedActiveConversation.revisions.some(revision => 
        revision.conversation.some(message => message.role === 'assistant')
      );
  
      if (hasAssistantMessage) {
        // generateConversationTitle を呼び出してタイトルを自動生成
        generateConversationTitle({
          apiKey: apiKey, 
          model: 'gpt-3.5-turbo-0613',
          messages: updatedActiveConversation.revisions[0].conversation
        }).then(newTitle => {
          if (newTitle) {
            updatedActiveConversation.title = newTitle;
            handleUpdateConversations(updatedActiveConversation).catch(err => {
              console.error("Error updating the conversation:", err);
            });
          }
        }).catch(err => {
          console.error("Error generating title:", err);
        });
      }
    }
  
    if (updatedActiveConversation) { 
      setActiveConversation(updatedActiveConversation);
    } else if (!conversations.some(conv => conv.id === activeConversation?.id)) {
      setActiveConversation(null);
    }
  }, [conversations, apiKey, model]);

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
    
    const savedGcpApiKey = localStorage.getItem('gcpApiKey');
    const savedApiKey = localStorage.getItem('apiKey');

    if (savedGcpApiKey) {
      setGcpApiKey(savedGcpApiKey);
    }
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  
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
        apiKey={apiKey}
        setApiKey={setApiKey}
        conversations={conversations}
        model={model}
        setModel={setModel}
        activeConversation={activeConversation}
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
            setIsConversationLoading={setIsConversationLoading}
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
            setQueuedMessageForReceivingId={setQueuedMessageForReceivingId}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            isConversationLoading={isConversationLoading}
            setIsConversationLoading={setIsConversationLoading}
            gcpApiKey={gcpApiKey}
            setGcpApiKey={setGcpApiKey}
          />
        ) : (
          <></>
        )}
      </MainContainer>
    </ScrollWrapper>
  );
}

export default App;
