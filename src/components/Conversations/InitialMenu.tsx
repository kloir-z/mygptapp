import React, { useState, useEffect } from 'react';
import { Spinner } from './Spinner'
import { getYoutubeTranscript } from 'src/utils/openAIUtil';
import { SystemPromptType, ConversationType, ConversationData } from './types/Conversations.types';
import { InitialMenuContainer, StyledSelect, StyledOption, StyledInput, StyledButton } from './styles/InitialMenu.styles';

type InitialMenuProps = {
  systemprompts: SystemPromptType[];
  activeConversation: ConversationType;
  handleUpdateConversations: (updatedConversation: ConversationType, shouldUpdateFirestore: boolean) => Promise<void>;
};

type SystemPromptActionsType = {
    [key: string]: () => void;
    '日本語要約': () => void;
    '英語要約': () => void;
  };

const InitialMenu: React.FC<InitialMenuProps> = ({ systemprompts, activeConversation, handleUpdateConversations }) => {
  const [showTranscriptPopup, setShowTranscriptPopup] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [selectedPromptId, setSelectedPromptId] = useState<string>("none");

  const systemPromptActions: SystemPromptActionsType = {
    '日本語要約': async () => {if (!activeConversation.revisions[0].conversation.some(message => message.role === 'user')) { setShowTranscriptPopup(true); }},
    '英語要約': async () => {if (!activeConversation.revisions[0].conversation.some(message => message.role === 'user')) { setShowTranscriptPopup(true); }}
    // 他のプロンプトと機能を追加
  };

  useEffect(() => {
    setSelectedPromptId("none");
    setShowTranscriptPopup(false); 
    if (activeConversation.revisions[0].conversation[0]?.role === 'system') {
      const systemContent = activeConversation.revisions[0].conversation[0].content;
      const matchingPrompt = systemprompts.find(prompt => prompt.content === systemContent);
      
      if (matchingPrompt) {
        setSelectedPromptId(matchingPrompt.id);
      }
    }
  }, [activeConversation, systemprompts]);

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
      const action = systemPromptActions[selectedPrompt.title];
      if (action) {
        action();
      } else {
        setShowTranscriptPopup(false);
      }

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

  const handleGetYtbTranscript = async () => {
    if (youtubeUrl) {
      setLoadingTranscript(true);
      const transcript = await getYoutubeTranscript(youtubeUrl);
      if (transcript) {
        const updatedMessages = [...activeConversation.revisions[0].conversation, { content: transcript, role: 'user' }];
        const updatedConversation = {
          ...activeConversation,
          revisions: [
            { revision: '0', conversation: updatedMessages },
          ],
        };
        setLoadingTranscript(false);
        await handleUpdateConversations(updatedConversation, false);
      }
    }
  };

  return (
    <InitialMenuContainer>
      <StyledSelect value={selectedPromptId} onChange={e => handleSystemPromptSelection(e.target.value)}>
        <StyledOption value="none">None</StyledOption>
        {systemprompts.map(prompt => (
          <StyledOption key={prompt.id} value={prompt.id}>{prompt.title}</StyledOption>
        ))}
      </StyledSelect>
      {showTranscriptPopup && (
        <>
          <StyledInput type="text" placeholder="YouTube URL" onChange={e => setYoutubeUrl(e.target.value)} />
          <StyledButton onClick={handleGetYtbTranscript}>GetTranscript</StyledButton>
        </>
      )}
      {loadingTranscript && <Spinner />}
    </InitialMenuContainer>
  );
};

export default InitialMenu;