import React, { useState, useContext } from "react";
import { AuthContext } from '../Auth/AuthContext';
import SystemPromptSettings from './SystemPromptSettings'; 
import { SystemPromptType } from '../../types/Conversations.types';
import { updateSystemPrompts  } from '../Auth/firebase';
import { Overlay, ModalContainer, CloseButton, StatusLabel, StyledButton, StyledInput } from '../../styles/SettingsModal.styles';

type SettingsModalProps = {
  show: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  systemprompts: SystemPromptType[];
  setSystemPrompts: React.Dispatch<React.SetStateAction<SystemPromptType[]>>;
};

const SettingsModal: React.FC<SettingsModalProps> = ({ show, onClose, apiKey, setApiKey, systemprompts, setSystemPrompts }) => {
  const { user } = useContext(AuthContext);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [fadeStatus, setFadeStatus] = useState<'in' | 'out'>('in');

  const handleClose = () => {
    setFadeStatus('out');
    setTimeout(() => {
      setFadeStatus('in');
      onClose();
    }, 210);
  };
    
  const handleOkClick = () => {
    setApiKey(tempApiKey);
    localStorage.setItem('apiKey', tempApiKey);
  };
  
  const handleUpdateSystemPrompts = async (updatedSystemPrompts: SystemPromptType[]) => {
    setSystemPrompts(updatedSystemPrompts);
    await updateSystemPrompts(user?.uid, updatedSystemPrompts);
  };

  return (
    show ? 
    <Overlay fadeStatus={fadeStatus} onMouseDown={handleClose}>
      <ModalContainer fadeStatus={fadeStatus} onMouseDown={e => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>×</CloseButton>
        <form>
          <label>Set your OpenAI API key here.</label><br></br>
          <StatusLabel active={Boolean(apiKey)}>●</StatusLabel>
          <StyledInput 
            type="password" 
            value={tempApiKey}
            onChange={e => setTempApiKey(e.target.value)} 
            onKeyDown={e => { if (e.key === 'Enter') { handleOkClick(); } }} 
            placeholder="API Key" 
            autoComplete="new-password"
          />
          <StyledButton type="button" onClick={handleOkClick}>Set</StyledButton>
        </form>
        <SystemPromptSettings
          systemprompts={systemprompts}
          onUpdate={handleUpdateSystemPrompts}
        />
        </ModalContainer>
    </Overlay> : null
  );
};

export default SettingsModal;