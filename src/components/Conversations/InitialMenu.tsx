import React, { useState } from 'react';
import { Spinner } from './Spinner'
import { getYoutubeTranscript } from 'src/utils/openAIUtil';
import { SystemPromptType, ConversationType, ConversationData } from './types/Conversations.types';
import { InitialMenuContainer, StyledSelect, StyledOption, StyledInput, StyledButton } from './styles/InitialMenu.styles';

type InitialMenuProps = {
  systemprompts: SystemPromptType[];
  conversation: ConversationType;
  handleUpdateConversations: (updatedConversation: ConversationType, shouldUpdateFirestore: boolean) => Promise<void>;
  displayMessages: ConversationData[];
  setDisplayMessages: React.Dispatch<React.SetStateAction<ConversationData[]>>;
};

type SystemPromptActionsType = {
    [key: string]: () => void;
    '日本語要約': () => void;
    '英語要約': () => void;
  };

const InitialMenu: React.FC<InitialMenuProps> = ({ systemprompts, conversation, handleUpdateConversations, displayMessages, setDisplayMessages }) => {
  const [showTranscriptPopup, setShowTranscriptPopup] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);
  const [loadingTranscript, setLoadingTranscript] = useState(false);

  const systemPromptActions: SystemPromptActionsType = {
    '日本語要約': () => { if (!displayMessages.some(message => message.role === 'user')) setShowTranscriptPopup(true); },
    '英語要約': () => { if (!displayMessages.some(message => message.role === 'user')) setShowTranscriptPopup(true); }
    // 他のプロンプトと機能を追加
  };

  const handleSystemPromptSelection = (selectedPromptId: string) => {
    if (selectedPromptId === 'none') {
      if (displayMessages[0]?.role === 'system') {
        setDisplayMessages(prevMessages => prevMessages.slice(1));
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

      setDisplayMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        if (updatedMessages[0]?.role === 'system') {
          updatedMessages[0] = { content: selectedPrompt.content, role: 'system' };
        } else {
          updatedMessages.unshift({ content: selectedPrompt.content, role: 'system' });
        }
        return updatedMessages;
      });
    }
  };

  const handleGetYtbTranscript = async () => {
    if (youtubeUrl) {
      setLoadingTranscript(true);
      const transcript = await getYoutubeTranscript(youtubeUrl);
      if (transcript) {
        setDisplayMessages(prevMessages => [...prevMessages, { content: transcript, role: 'user' }]);
        const updatedConversation = { ...conversation, revisions: [{ revision: '0', conversation: displayMessages.concat({ content: transcript, role: 'user' }) }]};
        setLoadingTranscript(false);
        handleUpdateConversations(updatedConversation, false);
      }
    }
  };

  return (
    <InitialMenuContainer>
      <StyledSelect onChange={e => handleSystemPromptSelection(e.target.value)}>
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