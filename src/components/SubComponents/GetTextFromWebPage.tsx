// MarkdownContentFetch.tsx
import React, { useState } from 'react';
import { ConversationType } from '../../types/Conversations.types';
import { getMarkdownContent } from 'src/utils/openAIUtil';
import { Spinner } from '../Parts/Spinner';
import { StyledButton, StyledInput } from '../../styles/InitialMenu.styles';

type MarkdownContentFetchProps = {
  activeConversation: ConversationType;
  handleUpdateConversations: (updatedConversation: ConversationType, shouldUpdateFirestore: boolean) => Promise<void>;
};

const GetTextFromWebPage: React.FC<MarkdownContentFetchProps> = ({ activeConversation, handleUpdateConversations }) => {
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const [loadingContentFetch, setLoadingContentFetch] = useState(false);

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
    <>
      <label>2. Use Get Text from Web Page:</label>
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
  );
};

export default GetTextFromWebPage;
