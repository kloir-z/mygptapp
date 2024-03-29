//Topbar.tsx
import React, { useState, useRef, useEffect, useContext } from "react";
import { TopbarContainer, StyledButton, StyledSelect, StyledOption, NotificationDot, TopbarArea } from '../../styles/Topbar.styles';
import { ConversationType, SystemPromptType, ModelOption } from '../../types/Conversations.types';
import { FaBars, FaCog, FaUser } from 'react-icons/fa';
import SettingsModal from '../SubComponents/SettingsModal'; 
import TokenCounter from '../Parts/TokenCounter';
import UserMenu from '../SubComponents/UserMenu';

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
    { value: 'gpt-3.5-turbo', label: 'gpt3.5(4k)' },
    { value: 'gpt-3.5-turbo-1106', label: 'gpt3.5(16k)' },
    { value: 'gpt-4-1106-preview', label: '4-1106(128k)' },
    { value: 'gpt-4-turbo-preview', label: '4-turbo(128k)' },
    { value: 'gpt-4-0125-preview', label: '4-0125(128k)' }
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
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('');
  const userButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const currentTotalTokens = totalTokenCount + inputTokenCount;
  
    const newAvailableModels: ModelOption[] = modelOptions.filter(option => {
      if (option.value === 'gpt-3.5-turbo') return currentTotalTokens < 4096 - 800;
      if (option.value === 'gpt-3.5-turbo-1106') return currentTotalTokens < 16384 - 1500;
      if (option.value === 'gpt-4-1106-preview') return currentTotalTokens < 128000 - 800;
      if (option.value === 'gpt-4-turbo-preview') return currentTotalTokens < 128000 - 800;
      if (option.value === 'gpt-4-0125-preview') return currentTotalTokens < 128000 - 800;
      return false;
    });
    
    setAvailableModels(newAvailableModels);
  
    const isCurrentModelAvailable = newAvailableModels.some(modelOption => modelOption.value === model);
    
    if (model === 'gpt-3.5-turbo-1106' && currentTotalTokens < 4096 - 800 && isAutoSwitched) {
      setModel('gpt-3.5-turbo');
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
    setShowTooltip(true);
    setTooltipMessage(`${newModel}`);
    setTimeout(() => setShowTooltip(false), 2000);
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
        {showTooltip && <Tooltip message={tooltipMessage} />}
        <SettingsModal
          show={showSettings}
          onClose={() => setShowSettings(false)}
          apiKey={apiKey}
          setApiKey={setApiKey}
          systemprompts={systemprompts}
          setSystemPrompts={setSystemPrompts}
        />
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
              <UserMenu
                userButtonRef={userButtonRef}
                setShowUserMenu={setShowUserMenu}
              />
            )}
          </div>
        </div>
      </TopbarContainer>
    </TopbarArea>
  );
};

export default Topbar;

const Tooltip = ({ message }: { message: string }) => {
  return (
    <div style={{ borderRadius: '8px', padding: '7px', position: 'absolute', top: '36px', left: '80px', backgroundColor: 'black' }}>
      {message}
    </div>
  );
};