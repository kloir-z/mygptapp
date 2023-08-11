import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from '../Auth/AuthContext';
import { ConversationType, SystemPromptType } from '../Conversations/Conversations.types';
import { fetchConversations, updateConversations  } from '../Auth/firebase';
import { MainContainer, Placeholder } from './App.styles'
import Topbar from '../Conversations/Topbar'
import Sidebar from '../Conversations/Sidebar'
import Conversation from '../Conversations/Conversation'

const App: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationType | null>(null);
  const [systemprompts, setSystemPrompts] = useState<SystemPromptType[]>([]);
  const [showMenu, setShowMenu] = useState(true);
  const [model, setModel] = useState('gpt-3.5-turbo-0613'); 
  const [apiKey, setApiKey] = useState('');
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(200); // 200はデフォルト値

  const scrollToBottom = () => {
    if(messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [showMenu]);

  useEffect(() => {
    const fetchUserConversations = async () => {
      const result = await fetchConversations(user?.uid);
      if (Array.isArray(result)) return;
      const { messages, systemPrompts } = result;
      const conversations: ConversationType[] = messages.map((message: any) => ({id: message.id, ...message} as ConversationType));
      const systemprompts: SystemPromptType[] = systemPrompts.map((systemPrompt: any) => ({id: systemPrompt.id, ...systemPrompt} as SystemPromptType));
      setConversations(conversations);
      setSystemPrompts(systemprompts);
      console.log(systemprompts);
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

  const handleTouchStart = (e: React.TouchEvent) => {
    // タッチが始まったら、moveとendのイベントリスナーを追加
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchMove = (e: TouchEvent) => {
    // タッチ位置を取得してサイドバーの幅を変更
    setSidebarWidth(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    // タッチが終了したら、イベントリスナーを削除
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
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
          <div 
            onMouseDown={handleMouseDown} 
            onTouchStart={handleTouchStart}
            style={{ cursor: 'col-resize' }}
          ></div>
          <Sidebar
            style={{ width: sidebarWidth }}
            conversations={conversations}
            activeConversation={activeConversation}
            setConversations={setConversations}
            setActiveConversation={setActiveConversation}
          />
          )}
          {activeConversation ? (
            <Conversation
              forwardedRef={messageContainerRef}
              conversation={activeConversation}
              model={model}
              apiKey={apiKey}
              sendMessage={handleMessageSend}
              systemprompts={systemprompts}
            />
          ) : (
            <Placeholder>Please select a conversation</Placeholder>
          )}
      </MainContainer>
    </>
  );
}

export default App;
