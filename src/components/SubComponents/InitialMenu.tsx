//InitialMenu.tsx
import React, { useState, useEffect } from 'react';
import { Spinner } from '../Parts/Spinner'
import { getYoutubeTranscript, getMarkdownContent } from 'src/utils/openAIUtil';
import { SystemPromptType, ConversationType, ConversationData } from '../../types/Conversations.types';
import { InitialMenuContainer, StyledSelect, StyledOption, StyledInput, StyledButton } from '../../styles/InitialMenu.styles';
import OCRComponent from './OCRComponent';
import VoiceInput from './VoiceInput';

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
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const [loadingContentFetch, setLoadingContentFetch] = useState(false);
  const [selectedPromptId, setSelectedPromptId] = useState<string>("none");
  const [showOcrPopup, setShowOcrPopup] = useState(false);
  const [ocrText, setOcrText] = useState<string | null>(null);
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
        } else if (matchingPrompt.title === 'URL要約') {
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
  }, [ocrText]);

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

  const handleYoutubeTranscriptFetch = async (url: string | null) => {
    if (!url) return;
    setLoadingContentFetch(true);
    const content = await getYoutubeTranscript(url);
    if (content !== null) {
      let updatedMessages = [...activeConversation.revisions[0].conversation];
      updatedMessages.push({ content: content, role: 'user' });
  
      const updatedConversation = {
        ...activeConversation,
        revisions: [
          { revision: '0', conversation: updatedMessages },
        ],
      };
      setLoadingContentFetch(false);
      await handleUpdateConversations(updatedConversation, false);
    }
  };

  const handleMarkdownContentFetch = async (url: string | null) => {
    if (!url) return;
  
    setLoadingContentFetch(true);
  
    const fetchedContentArray = await getMarkdownContent(url);
  
    if (!Array.isArray(fetchedContentArray)) {
      console.log('Failed to fetch Markdown content or content is not an array');
      setLoadingContentFetch(false);
      return;
    }
    
    let updatedMessages = [...activeConversation.revisions[0].conversation];
    const allLines = fetchedContentArray.map(content => content.split('\n'));
    const linesToRemove = new Set<string>();
  
    if (allLines.length > 1) {
      for (const line of allLines[0]) {
        if (allLines.every(lines => lines.includes(line))) {
          linesToRemove.add(line);
        }
      }
  
      allLines.forEach(linesInPage => {
        const filteredLines = linesInPage.filter(line => !linesToRemove.has(line));
        updatedMessages.push({ content: filteredLines.join('\n'), role: 'user' });
      });
    } else if (allLines.length === 1) {
      updatedMessages.push({ content: allLines[0].join('\n'), role: 'user' });
    }
  
    const updatedConversation = {
      ...activeConversation,
      revisions: [
        { revision: '0', conversation: updatedMessages },
      ],
    };
  
    setLoadingContentFetch(false);
    await handleUpdateConversations(updatedConversation, false);
  };
  
  const fetchFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setTargetUrl(clipboardText);
    } catch (err) {
      console.error("クリップボードからテキストを取得できませんでした:", err);
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
            <StyledButton onClick={fetchFromClipboard}>Get from Clipboard</StyledButton>
            <StyledInput type="text" placeholder="YouTube URL" onChange={e => setTargetUrl(e.target.value)} value={targetUrl || ''}/>
          <br></br>
            <StyledButton 
              onClick={() => handleYoutubeTranscriptFetch(targetUrl)} 
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
            <StyledButton onClick={fetchFromClipboard}>Get from Clipboard</StyledButton>
            <StyledInput type="text" placeholder="URL" onChange={e => setTargetUrl(e.target.value)} value={targetUrl || ''}/>
          <br></br>
            <StyledButton 
              onClick={() => handleMarkdownContentFetch(targetUrl)} 
              disabled={loadingContentFetch}
            >
              {loadingContentFetch ? <Spinner /> : 'Get Content'}
            </StyledButton>
          </div>
          <br></br>
        </>
      )}
      {showVoiceModePopup &&
        <VoiceInput
          setOcrText={setOcrText} 
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
          setOcrText={setOcrText} 
          gcpApiKey={gcpApiKey}
          setGcpApiKey={setGcpApiKey}
        />
      }

    </InitialMenuContainer>
  );
};

export default InitialMenu;