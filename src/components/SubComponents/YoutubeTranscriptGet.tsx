// YoutubeTranscriptFetch.tsx
import React, { useState } from 'react';
import { getYoutubeTranscript } from 'src/utils/openAIUtil';
import { ConversationType } from '../../types/Conversations.types';
import { Spinner } from '../Parts/Spinner';
import { StyledButton, StyledInput } from '../../styles/InitialMenu.styles';

type YoutubeTranscriptFetchProps = {
  activeConversation: ConversationType;
  handleUpdateConversations: (updatedConversation: ConversationType, shouldUpdateFirestore: boolean) => Promise<void>;
};

const YoutubeTranscriptFetch: React.FC<YoutubeTranscriptFetchProps> = ({ activeConversation, handleUpdateConversations }) => {
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const [loadingContentFetch, setLoadingContentFetch] = useState(false);

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

  const fetchFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setTargetUrl(clipboardText);
    } catch (err) {
      console.error("Failed to retrieve text from clipboard:", err);
    }
  };

  return (
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
  );
};

export default YoutubeTranscriptFetch;
