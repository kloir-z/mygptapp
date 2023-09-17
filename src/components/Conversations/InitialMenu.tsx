//InitialMenu.tsx
import React, { useState, useEffect } from 'react';
import { Spinner } from './Spinner'
import { getYoutubeTranscript, getMarkdownContent } from 'src/utils/openAIUtil';
import { SystemPromptType, ConversationType, ConversationData } from '../types/Conversations.types';
import { InitialMenuContainer, StyledSelect, StyledOption, StyledInput, StyledButton } from '../styles/InitialMenu.styles';
import OCRComponent from './OCRComponent';

type InitialMenuProps = {
  systemprompts: SystemPromptType[];
  activeConversation: ConversationType;
  handleUpdateConversations: (updatedConversation: ConversationType, shouldUpdateFirestore: boolean) => Promise<void>;
  gcpApiKey: string;
  setGcpApiKey: React.Dispatch<React.SetStateAction<string>>;
};

const InitialMenu: React.FC<InitialMenuProps> = ({ systemprompts, activeConversation, handleUpdateConversations, gcpApiKey, setGcpApiKey }) => {
  const [showTranscriptPopup, setShowTranscriptPopup] = useState(false);
  const [showGetMdTxtPopup, setShowGetMdTxtPopup] = useState(false);
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const [loadingContentFetch, setLoadingContentFetch] = useState(false);
  const [selectedPromptId, setSelectedPromptId] = useState<string>("none");
  const [showOcrPopup, setShowOcrPopup] = useState(false);
  const [ocrText, setOcrText] = useState<string | null>(null);

  useEffect(() => {
    setSelectedPromptId("none");
    setShowTranscriptPopup(false); 
    setShowGetMdTxtPopup(false);
    setShowOcrPopup(false);
    if (activeConversation.revisions[0].conversation[0]?.role === 'system') {
      const systemContent = activeConversation.revisions[0].conversation[0].content;
      const matchingPrompt = systemprompts.find(prompt => prompt.content === systemContent);
      
      if (matchingPrompt) {
        setSelectedPromptId(matchingPrompt.id);
        if (matchingPrompt.title === 'Youtube要約') {
          setShowTranscriptPopup(true);
        } else if (matchingPrompt.title === 'URL要約') {
          setShowGetMdTxtPopup(true);
        } else if (matchingPrompt.title === 'OCRして要約') {
          setShowOcrPopup(true);
        }
      }
    }
  }, [activeConversation, systemprompts]);
  
  useEffect(() => {
    if (ocrText) {
      const updatedMessages = [...activeConversation.revisions[0].conversation];
      updatedMessages.push({ content: ocrText, role: 'user' });

      const updatedConversation = {
        ...activeConversation,
        revisions: [
          { revision: '0', conversation: updatedMessages },
        ],
      };

      handleUpdateConversations(updatedConversation, false).then(() => {
        // 成功したらocrTextをnullにリセット
        setOcrText(null);
      });
    }
  }, [ocrText, activeConversation, handleUpdateConversations]);

  const handleSystemPromptSelection = async (selectedPromptId: string) => {
    setSelectedPromptId(selectedPromptId);
    if (selectedPromptId === 'none') {
      if (activeConversation.revisions[0].conversation[0]?.role === 'system') {
        const updatedConversation = {
          ...activeConversation,
          revisions: [
            { revision: '0', conversation: activeConversation.revisions[0].conversation.slice(1) },
          ],
        };
        await handleUpdateConversations(updatedConversation, false);
      }
      setShowTranscriptPopup(false);
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
        revisions: [
          { revision: '0', conversation: updatedMessages },
        ],
      };
      await handleUpdateConversations(updatedConversation, false);
    }
  };
  type FetchFunctionType = (url: string) => Promise<string[] | string | null>;

  const handleContentFetch = async (fetchFunction: FetchFunctionType, contentUrl: string | null, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (contentUrl) {
      setLoading(true);
      const fetchedContentArray = await fetchFunction(contentUrl);
      if (fetchedContentArray) {
        let updatedMessages = [...activeConversation.revisions[0].conversation];
        if (Array.isArray(fetchedContentArray)) {
          for (const fetchedContent of fetchedContentArray) {
            updatedMessages.push({ content: fetchedContent, role: 'user' });
          }
        } else if (typeof fetchedContentArray === 'string') {
          updatedMessages.push({ content: fetchedContentArray, role: 'user' });
        }
  
        const updatedConversation = {
          ...activeConversation,
          revisions: [
            { revision: '0', conversation: updatedMessages },
          ],
        };
        setLoading(false);
        await handleUpdateConversations(updatedConversation, false);
      }
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
        <>
          <label>2. Use Youtube Transcript Get Tool:</label>
          <div style={{display: 'flex', flexDirection:'column', paddingLeft: '10px'}}>
            <StyledInput type="text" placeholder="YouTube URL" onChange={e => setTargetUrl(e.target.value)} />
            <StyledButton 
              onClick={() => handleContentFetch(getYoutubeTranscript, targetUrl, setLoadingContentFetch)} 
              disabled={loadingContentFetch}
            >
              {loadingContentFetch ? <Spinner /> : 'Get Content'}
            </StyledButton>
          </div>
          <br></br>
        </>
      )}
      
      {showGetMdTxtPopup && (
        <>
          <label>2. Use Get Markdown Text from URL Tool:</label>
          <div style={{display: 'flex', flexDirection:'column', paddingLeft: '10px'}}>
            <StyledInput type="text" placeholder="URL" onChange={e => setTargetUrl(e.target.value)} />
            <StyledButton 
              onClick={() => handleContentFetch(getMarkdownContent, targetUrl, setLoadingContentFetch)} 
              disabled={loadingContentFetch}
            >
              {loadingContentFetch ? <Spinner /> : 'Get Content'}
            </StyledButton>
          </div>
          <br></br>
        </>
      )}
      {showOcrPopup &&
        <OCRComponent
          setOcrText={setOcrText} 
          gcpApiKey={gcpApiKey}
          setGcpApiKey={setGcpApiKey}
        />
      }

    </InitialMenuContainer>
  );
};

export default InitialMenu;