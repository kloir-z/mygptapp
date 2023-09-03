//Topbar.tsx
import React, { useState, useRef, useEffect, useContext } from "react";
import { TopbarContainer, StyledButton, StyledSelect, StyledOption, NotificationDot } from './styles/Topbar.styles';
import { ConversationType, SystemPromptType } from './types/Conversations.types';
import { FaBars, FaCog, FaUser } from 'react-icons/fa';
import SettingsModal from './SettingsModal'; 
import TokenCounter from './TokenCounter';
import { AuthContext } from 'src/components/Auth/AuthContext';  
import GoogleButton from "../Conversations/GoogleButton";

type TopbarProps = {
    apiKey: string;
    setApiKey: React.Dispatch<React.SetStateAction<string>>;
    conversations: ConversationType[];
    model: string;
    setModel: React.Dispatch<React.SetStateAction<string>>;
    activeConversation: ConversationType | null;
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
    systemprompts: SystemPromptType[];
    setSystemPrompts: React.Dispatch<React.SetStateAction<SystemPromptType[]>>;
    setSidebarTransition: React.Dispatch<React.SetStateAction<boolean>>;
    inputMessage: string;
  };
  
const Topbar: React.FC<TopbarProps> = ({ apiKey, setApiKey, conversations, model, setModel, activeConversation, setShowMenu, systemprompts, setSystemPrompts, setSidebarTransition, inputMessage }) => {
  const [totalTokenUpdateRequired, setTotalTokenUpdateRequired] = useState(false);
  const [inputTokenUpdateRequired, setInputTokenUpdateRequired] = useState(false);

  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const apiKeyInputRef = useRef<HTMLDivElement | null>(null);
  const apiKeyButtonRef = useRef<HTMLButtonElement | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const { handleLogout } = useContext(AuthContext);
  

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (apiKeyButtonRef.current !== event.target && apiKeyInputRef.current && !apiKeyInputRef.current.contains(event.target as Node)) {
        setShowApiKeyInput(false);
        setTempApiKey(apiKey);
      }
    }
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [apiKey]);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setShowMenu((prevState: Boolean) => !prevState);
    setSidebarTransition(true);
    setTimeout(() => {
      setSidebarTransition(false);
    }, 210);
  };

  return(
    <TopbarContainer>
      <StyledButton onClick={toggleMenu}>
        <FaBars />
      </StyledButton>
      <StyledButton onClick={() => setShowSettings(true)}>
        <FaCog />{apiKey ? null : <NotificationDot>●</NotificationDot>}
      </StyledButton>
      <SettingsModal show={showSettings} onClose={() => setShowSettings(false)} apiKey={apiKey} setApiKey={setApiKey} systemprompts={systemprompts} setSystemPrompts={setSystemPrompts} />
      <StyledSelect value={model} onChange={e => setModel(e.target.value)}>  
        <StyledOption value="gpt-3.5-turbo-16k-0613">gpt3.5(16k)</StyledOption>
        <StyledOption value="gpt-3.5-turbo-0613">gpt3.5(4k)</StyledOption>
        <StyledOption value="gpt-4-0613">gpt4(8k)</StyledOption>
      </StyledSelect>
      <TokenCounter
        conversations={conversations}
        activeConversation={activeConversation}
        totalTokenUpdateRequired={totalTokenUpdateRequired}
        setTotalTokenUpdateRequired={setTotalTokenUpdateRequired}
        inputTokenUpdateRequired={inputTokenUpdateRequired}
        setInputTokenUpdateRequired={setInputTokenUpdateRequired}
        inputMessage={inputMessage}
      />
      <div style={{ position: 'absolute', right: '0px' }}>
      <div style={{ position: 'relative', direction: 'rtl' }}>
        <StyledButton onClick={() => setShowUserMenu(!showUserMenu)}>
          <FaUser />
        </StyledButton>
        {showUserMenu && (
          <div ref={userMenuRef} style={{ position: 'absolute', bottom: 'auto', zIndex: '1000'}}>
            <GoogleButton isSignedIn={true} onClick={handleLogout} />
          </div>
        )}
      </div>
      </div>
    </TopbarContainer>
  );
};

export default Topbar;