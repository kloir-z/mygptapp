import React, { useState, useRef, useEffect } from "react";
import { TopbarContainer, StyledButton, StyledSelect, StyledOption } from './styles/Topbar.styles';
import { ConversationType, SystemPromptType } from './types/Conversations.types';
import { v4 as uuidv4 } from 'uuid'; 
import SettingsModal from './SettingsModal'; 

type TopbarProps = {
    conversations: ConversationType[];
    model: string;
    setModel: React.Dispatch<React.SetStateAction<string>>;
    apiKey: string;
    setApiKey: React.Dispatch<React.SetStateAction<string>>;
    activeConversation: ConversationType | null;
    setConversations: React.Dispatch<React.SetStateAction<ConversationType[]>>;
    setActiveConversation: React.Dispatch<React.SetStateAction<ConversationType | null>>;
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
    systemprompts: SystemPromptType[];
    setSystemPrompts: React.Dispatch<React.SetStateAction<SystemPromptType[]>>;
  };

const createNewConversation = (): ConversationType => {
    return {
      id: uuidv4(),
      title: "New Conversation",
      revisions: [
        {
          revision: "0",
          conversation: [],
        },
      ],
    };
  };
  
const Topbar: React.FC<TopbarProps> = ({ apiKey, setApiKey, model, setModel, setConversations, setActiveConversation, setShowMenu, systemprompts, setSystemPrompts }) => {
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const apiKeyInputRef = useRef<HTMLDivElement | null>(null);
  const apiKeyButtonRef = useRef<HTMLButtonElement | null>(null);
  const [showSettings, setShowSettings] = useState(false);

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

    const toggleMenu = () => {
        setShowMenu((prevState: Boolean) => !prevState);
    };

    return(
        <TopbarContainer>
            <StyledButton onClick={toggleMenu}>Menu</StyledButton>
            <StyledButton onClick={() => {
            const newConv = createNewConversation();
            setConversations((prev: ConversationType[]) => [...prev, newConv]);
            setActiveConversation(newConv);
            }}>New</StyledButton>
            <StyledButton onClick={() => setShowSettings(true)}>Settings</StyledButton>
            <SettingsModal show={showSettings} onClose={() => setShowSettings(false)} apiKey={apiKey} setApiKey={setApiKey} systemprompts={systemprompts} setSystemPrompts={setSystemPrompts} />
            <StyledSelect value={model} onChange={e => setModel(e.target.value)}>  
                <StyledOption value="gpt-3.5-turbo-16k-0613">gpt3.5(16k)</StyledOption>
                <StyledOption value="gpt-3.5-turbo-0613">gpt3.5(4k)</StyledOption>
                <StyledOption value="gpt-4-0613">gpt4(8k)</StyledOption>
            </StyledSelect>
        </TopbarContainer>
    );
};

export default Topbar;