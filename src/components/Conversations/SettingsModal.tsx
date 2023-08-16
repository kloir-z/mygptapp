import React, { useState, useContext } from "react";
import { AuthContext } from '../Auth/AuthContext';
import SystemPromptSettings from './SystemPromptSettings'; 
import { SystemPromptType } from './types/Conversations.types';
import { updateSystemPrompts  } from '../Auth/firebase';
import { StyledButton, StyledInput } from './styles/Settings.styles';

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

  const handleOkClick = () => {
    setApiKey(tempApiKey);
  };
  
  const handleUpdateSystemPrompts = async (updatedSystemPrompts: SystemPromptType[]) => {
    setSystemPrompts(updatedSystemPrompts);
    await updateSystemPrompts(user?.uid, updatedSystemPrompts);
  };

  return (
    show ? 
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onMouseDown={onClose}>
      <div style={{ position: 'relative', background: '#282c34', padding: '20px' }} onMouseDown={e => e.stopPropagation()}>
        <div style={{ position: 'absolute', top: '0px', right: '10px', cursor: 'pointer', fontSize: '1.7rem'}} onClick={onClose}>×</div>
        <label>Set your OpenAI API key here.</label><br></br>
        {!apiKey ? (<label style={{ color: 'red' }}>×</label>) : (<label style={{ color: 'green' }}>●</label>)}
        <StyledInput 
          type="password" 
          value={tempApiKey}
          onChange={e => setTempApiKey(e.target.value)} 
          onKeyDown={e => { if (e.key === 'Enter') { handleOkClick(); } }} 
          placeholder="API Key" 
        />
        <StyledButton onClick={handleOkClick}>Set</StyledButton>
        <SystemPromptSettings
          systemprompts={systemprompts}
          onUpdate={handleUpdateSystemPrompts}
        />
      </div>
    </div> : null
  );
};

export default SettingsModal;
