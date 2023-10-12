//InitialMenu.tsx
import React, { useState, useEffect } from 'react';
import { SystemPromptType, ConversationType } from '../../types/Conversations.types';
import { InitialMenuContainer, StyledSelect, StyledOption } from '../../styles/InitialMenu.styles';
import OCRComponent from './OCRComponent';
import VoiceInput from './VoiceInput';
import YoutubeTranscriptFetch from './YoutubeTranscriptGet';
import GetTextFromWebPage from './GetTextFromWebPage';

type InitialMenuProps = {
  systemprompts: SystemPromptType[];
  activeConversation: ConversationType;
  handleUpdateConversations: (updatedConversation: ConversationType, shouldUpdateFirestore: boolean) => Promise<void>;
  gcpApiKey: string;
  setGcpApiKey: React.Dispatch<React.SetStateAction<string>>;
  apiKey: string;
  autoRunOnLoad: boolean;
  setAutoRunOnLoad: React.Dispatch<React.SetStateAction<boolean>>;
  receivingMessage: string;
};

const InitialMenu: React.FC<InitialMenuProps> = ({ systemprompts, activeConversation, handleUpdateConversations, gcpApiKey, setGcpApiKey, apiKey, autoRunOnLoad, setAutoRunOnLoad, receivingMessage }) => {
  const [showTranscriptPopup, setShowTranscriptPopup] = useState(false);
  const [showGetMdTxtPopup, setShowGetMdTxtPopup] = useState(false);
  const [selectedPromptId, setSelectedPromptId] = useState<string>("none");
  const [showOcrPopup, setShowOcrPopup] = useState(false);
  const [returnText, setReturnText] = useState<string | null>(null);
  const [showVoiceModePopup, setShowVoiceModePopup] = useState(false);

  useEffect(() => {
    setSelectedPromptId("none");
    setShowTranscriptPopup(false);
    setShowGetMdTxtPopup(false);
    setShowOcrPopup(false);
    setShowVoiceModePopup(false);
    if (activeConversation.revisions[0].conversation[0]?.role === 'system') {
      const systemTitle = activeConversation.systemPromptTitle;
      const matchingPrompt = systemprompts.find(prompt => prompt.title === systemTitle);
      
      if (matchingPrompt) {
        setSelectedPromptId(matchingPrompt.id);
        if (matchingPrompt.title === 'Youtube要約') {
          setShowTranscriptPopup(true);
        } else if (matchingPrompt.title === 'Webページ要約') {
          setShowGetMdTxtPopup(true);
        } else if (matchingPrompt.title === 'OCRして要約') {
          setShowOcrPopup(true);
        } else if (matchingPrompt.title === 'VoiceMode') {
          setShowVoiceModePopup(true);
        }
      }
    }
  }, [activeConversation, systemprompts]);
  
  useEffect(() => {
    if (returnText) {
      const updatedMessages = [...activeConversation.revisions[0].conversation];
      updatedMessages.push({ content: returnText, role: 'user' });

      const updatedConversation = {
        ...activeConversation,
        revisions: [
          { revision: '0', conversation: updatedMessages },
        ],
      };

      handleUpdateConversations(updatedConversation, false).then(() => {
        // 成功したらreturnTextをnullにリセット
        setReturnText(null);
      });
    }
  }, [returnText]);

  const handleSystemPromptSelection = async (selectedPromptId: string) => {
    setSelectedPromptId(selectedPromptId);
    if (selectedPromptId === 'none') {
      if (activeConversation.revisions[0].conversation[0]?.role === 'system') {
        const updatedConversation = {
          ...activeConversation,
          systemPromptTitle: "",
          revisions: [
            { revision: '0', conversation: activeConversation.revisions[0].conversation.slice(1) },
          ],
        };
        await handleUpdateConversations(updatedConversation, false);
      }
      return;
    }  

    const selectedPrompt = systemprompts.find(prompt => prompt.id === selectedPromptId);
    if (selectedPrompt) {
      const updatedMessages = [...activeConversation.revisions[0].conversation];
      if (updatedMessages[0]?.role === 'system') {
        updatedMessages[0] = { content: selectedPrompt.content, role: 'system' };
      } else {
        updatedMessages.unshift({ content: selectedPrompt.content, role: 'system' });
      }
      const updatedConversation = {
        ...activeConversation,
        systemPromptTitle: selectedPrompt.title,
        revisions: [
          { revision: '0', conversation: updatedMessages },
        ],
      };
      await handleUpdateConversations(updatedConversation, false);
    }
  };

  return (
    <InitialMenuContainer>
      <label>1. Select System Prompt:</label>
      <div style={{display: 'flex', flexDirection:'row', paddingLeft: '10px'}}>
        <StyledSelect value={selectedPromptId} onChange={e => handleSystemPromptSelection(e.target.value)}>
          <StyledOption value="none">None</StyledOption>
          {systemprompts.map(prompt => (
            <StyledOption key={prompt.id} value={prompt.id}>{prompt.title}</StyledOption>
          ))}
        </StyledSelect>
      </div>
      <br></br>
      {showTranscriptPopup && (
        <YoutubeTranscriptFetch 
          activeConversation={activeConversation}
          handleUpdateConversations={handleUpdateConversations}
        />
      )}
      
      {showGetMdTxtPopup && (
      <GetTextFromWebPage 
        activeConversation={activeConversation}
        handleUpdateConversations={handleUpdateConversations}
      />
      )}

      {showVoiceModePopup &&
        <VoiceInput
          setReturnText={setReturnText} 
          apiKey={apiKey}
          autoRunOnLoad={autoRunOnLoad}
          setAutoRunOnLoad={setAutoRunOnLoad}
          receivingMessage={receivingMessage}
          gcpApiKey={gcpApiKey}
          setGcpApiKey={setGcpApiKey}
        />
      }

      {showOcrPopup &&
        <OCRComponent
          setReturnText={setReturnText} 
          gcpApiKey={gcpApiKey}
          setGcpApiKey={setGcpApiKey}
        />
      }

    </InitialMenuContainer>
  );
};

export default InitialMenu;