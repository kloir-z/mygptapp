import React, { useState, useRef, useEffect } from "react";
import { SystemPromptType } from '../Conversations/Conversations.types';
import { SystemPromptSettingsContainer, StyledButton, StyledInput, StyledSelect, StyledOption, SystemPromptTextarea } from './Settings.styles';

type SystemPromptSettingsProps = {
  systemprompts: SystemPromptType[];
  onUpdate: (prompts: SystemPromptType[]) => void;
};

const SystemPromptSettings: React.FC<SystemPromptSettingsProps> = ({ systemprompts, onUpdate }) => {
  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const isWhitespace = (str: string) => !str.trim();
  const canCreate = !isWhitespace(title) && !isWhitespace(content) && !systemprompts.some(prompt => prompt.title === title || prompt.content === content);
  const canUpdate = selectedPromptIndex !== null && (title !== systemprompts[selectedPromptIndex]?.title || content !== systemprompts[selectedPromptIndex]?.content);

  const handleSelectionChange = (index: number) => {
    setSelectedPromptIndex(index === -1 ? null : index);
    setTitle(index === -1 ? "" : systemprompts[index]?.title || "");
    setContent(index === -1 ? "" : systemprompts[index]?.content || "");
  };

  const handleCreate = () => {
    if (canCreate) {
      const newPrompt: SystemPromptType = {
        id: Date.now().toString(),
        title,
        content,
      };
      onUpdate([...systemprompts, newPrompt]);
    }
  };

  const handleUpdate = () => {
    if (isWhitespace(title) || isWhitespace(content)) {
      return;
    }

    if (selectedPromptIndex !== null) {
      const updatedPrompt = {
        ...systemprompts[selectedPromptIndex],
        title,
        content,
      };
      onUpdate(systemprompts.map((prompt, index) => (index === selectedPromptIndex ? updatedPrompt : prompt)));
    }
  };

  const handleDelete = () => {
    if (selectedPromptIndex !== null) {
      const updatedPrompts = systemprompts.filter((_, index) => index !== selectedPromptIndex);
      onUpdate(updatedPrompts);
      handleSelectionChange(-1);
    }
  };

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if(textAreaRef.current){
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight + 2}px`;
    }
  }, [content]);

  return (
    <SystemPromptSettingsContainer>
      <label>System Prompt Settings:</label>
        <StyledSelect onChange={(e) => handleSelectionChange(Number(e.target.value))}>
          <StyledOption value={-1}>Clear</StyledOption>
          {systemprompts.map((prompt, index) => (
            <StyledOption key={prompt.id} value={index}>
              {prompt.title}
            </StyledOption>
          ))}
        </StyledSelect>
      <label>Edit Title:</label>
        <StyledInput placeholder="input great title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      <label>Edit Content:</label>
        <SystemPromptTextarea placeholder="input system prompt" value={content} onChange={(e) => setContent(e.target.value)} rows={content.split('\n').length || 1} ref={textAreaRef} />
        <div>
        <StyledButton disabled={!canCreate} onClick={handleCreate}>Create</StyledButton>
        <StyledButton disabled={!canUpdate} onClick={handleUpdate}>Update</StyledButton>
        <StyledButton onClick={handleDelete}>Delete</StyledButton>
        </div>
    </SystemPromptSettingsContainer>
  );
};

export default SystemPromptSettings;
