import React, { useState, useRef, useEffect } from "react";
import { TopbarContainer, StyledButton, ApiKeyButton, StyledInput, ApiKeyInputPopup, StyledSelect, StyledOption } from './Topbar.styles';
import { ConversationType } from './Conversations.types';
import { v4 as uuidv4 } from 'uuid'; 

type TopbarProps = {
    conversations: ConversationType[];
    model: string;
    setModel: Function;
    apiKey: string;
    setApiKey: Function;
    activeConversation: ConversationType | null;
    setConversations: Function;
    setActiveConversation: Function;
    setShowMenu: Function;
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
  
const Topbar: React.FC<TopbarProps> = ({ apiKey, setApiKey, model, setModel, setConversations, setActiveConversation, setShowMenu }) => {
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const apiKeyInputRef = useRef<HTMLDivElement | null>(null);
  const apiKeyButtonRef = useRef<HTMLButtonElement | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);


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

    const handleOkClick = () => {
      setApiKey(tempApiKey);
      setShowApiKeyInput(false);
    };

    const handleApiKeyButtonClick = () => {
      setShowApiKeyInput(prevState => {
        if (!prevState && apiKeyButtonRef.current) {
          const rect = apiKeyButtonRef.current.getBoundingClientRect();
          setPopupPosition({ top: rect.bottom, left: rect.left });
        }
        return !prevState;
      });
    };

    return(
        <TopbarContainer>
            <StyledButton onClick={toggleMenu}>Menu</StyledButton>

            <StyledButton onClick={() => {
            const newConv = createNewConversation();
            setConversations((prev: ConversationType[]) => [...prev, newConv]);
            setActiveConversation(newConv);
            }}>New</StyledButton>
            <ApiKeyButton ref={apiKeyButtonRef} onClick={handleApiKeyButtonClick}>API Key</ApiKeyButton>
            {showApiKeyInput && (
              <ApiKeyInputPopup ref={apiKeyInputRef} top={popupPosition?.top} left={popupPosition?.left}>
                Set your OpenAI API key here.
                <br></br>
                <StyledInput 
                  type="password" 
                  value={tempApiKey}
                  onChange={e => setTempApiKey(e.target.value)} 
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleOkClick();
                    }
                  }} 
                  placeholder="API Key" 
                />
                <StyledButton onClick={handleOkClick}>OK</StyledButton>
              </ApiKeyInputPopup>
            )}

            <StyledSelect value={model} onChange={e => setModel(e.target.value)}>  
                <StyledOption value="gpt-3.5-turbo-16k-0613">gpt3.5(16k)</StyledOption>
                <StyledOption value="gpt-3.5-turbo-0613">gpt3.5(4k)</StyledOption>
                <StyledOption value="gpt-4-0613">gpt4(8k)</StyledOption>
            </StyledSelect>
        </TopbarContainer>
    );
};

export default Topbar;