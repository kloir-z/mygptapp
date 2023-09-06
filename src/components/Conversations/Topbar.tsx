//Topbar.tsx
import React, { useState, useRef, useEffect, useContext } from "react";
import { TopbarContainer, StyledButton, StyledSelect, StyledOption, NotificationDot, TopbarArea } from '../styles/Topbar.styles';
import { ConversationType, SystemPromptType, ModelOption } from '../types/Conversations.types';
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

  const modelOptions: ModelOption[] = [
    { value: 'gpt-3.5-turbo-0613', label: 'gpt3.5(4k)' },
    { value: 'gpt-3.5-turbo-16k-0613', label: 'gpt3.5(16k)' },
    { value: 'gpt-4-0613', label: 'gpt4(8k)' }
  ];
  
const Topbar: React.FC<TopbarProps> = ({ apiKey, setApiKey, conversations, model, setModel, activeConversation, setShowMenu, systemprompts, setSystemPrompts, setSidebarTransition, inputMessage }) => {
  const [inputTokenCount, setInputTokenCount] = useState<number>(0);
  const [totalTokenCount, setTotalTokenCount] = useState<number>(0);
  const [totalTokenUpdateRequired, setTotalTokenUpdateRequired] = useState(false);
  const [inputTokenUpdateRequired, setInputTokenUpdateRequired] = useState(false);
  const [availableModels, setAvailableModels] = useState<ModelOption[]>([]);
  const [isAutoSwitched, setIsAutoSwitched] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const { handleLogout } = useContext(AuthContext);
  const userButtonRef = useRef<HTMLButtonElement | null>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        if (userButtonRef.current && userButtonRef.current.contains(event.target as Node)) {
          return;
        }
        setShowUserMenu(false);
      }
    }
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const currentTotalTokens = totalTokenCount + inputTokenCount;
  
    const newAvailableModels: ModelOption[] = modelOptions.filter(option => {
      if (option.value === 'gpt-3.5-turbo-0613') return currentTotalTokens < 4096 - 300;
      if (option.value === 'gpt-3.5-turbo-16k-0613') return currentTotalTokens < 16384 - 300;
      if (option.value === 'gpt-4-0613') return currentTotalTokens < 8192 - 300;
      return false;
    });
    
    setAvailableModels(newAvailableModels);
  
    const isCurrentModelAvailable = newAvailableModels.some(modelOption => modelOption.value === model);
    
    if (model === 'gpt-3.5-turbo-16k-0613' && currentTotalTokens < 4096 - 300 && isAutoSwitched) {
      setModel('gpt-3.5-turbo-0613');
      setIsAutoSwitched(true); 
    } 
    else if (!isCurrentModelAvailable) {
      setModel(newAvailableModels[0]?.value || '');
      setIsAutoSwitched(true); 
    }
  
  }, [totalTokenCount, inputTokenCount, model]);

  const handleModelChange = (newModel: string) => {
    setModel(newModel);
    setIsAutoSwitched(false);
  };
  
  const toggleMenu = () => {
    setShowMenu((prevState: Boolean) => !prevState);
    setSidebarTransition(true);
    setTimeout(() => {
      setSidebarTransition(false);
    }, 210);
  };

  return(
    <TopbarArea>
      <TopbarContainer>
        <StyledButton onClick={toggleMenu}>
          <FaBars />
        </StyledButton>
        <StyledButton onClick={() => setShowSettings(true)}>
          <FaCog />{apiKey ? null : <NotificationDot>●</NotificationDot>}
        </StyledButton>
        <SettingsModal show={showSettings} onClose={() => setShowSettings(false)} apiKey={apiKey} setApiKey={setApiKey} systemprompts={systemprompts} setSystemPrompts={setSystemPrompts} />
        <StyledSelect value={model} onChange={e => handleModelChange(e.target.value)}>  
          {availableModels.map((modelOption, index) => (
            <StyledOption key={index} value={modelOption.value}>
              {modelOption.label}
            </StyledOption>
          ))}
        </StyledSelect>
        <TokenCounter
          inputTokenCount={inputTokenCount}
          setInputTokenCount={setInputTokenCount}
          totalTokenCount={totalTokenCount}
          setTotalTokenCount={setTotalTokenCount}
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
          <StyledButton ref={userButtonRef} onClick={() => setShowUserMenu(!showUserMenu)}>
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
    </TopbarArea>
  );
};

export default Topbar;