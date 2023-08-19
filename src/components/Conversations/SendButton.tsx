import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faStop } from '@fortawesome/free-solid-svg-icons'
import { SendButton as StyledSendButton } from './styles/MessageInput.styles'

type SendButtonProps = {
  isAwaitingResponse: boolean;
  awaitGetAIResponse: (apiKey: string, message?: string, role?: string) => Promise<void>;
  handleStartResponse: () => void;
  handleStopResponse: () => void;
  apiKey: string;
  message?: string;
  setMessage?: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean; 
};

const SendButton: React.FC<SendButtonProps> = ({ isAwaitingResponse, awaitGetAIResponse, handleStartResponse, handleStopResponse, apiKey, message, setMessage, disabled }) => {
  const handleGetAIResponse = async () => {
    handleStartResponse();
    try {
      if (message && setMessage) {
        setMessage(''); 
        await awaitGetAIResponse(apiKey, message, 'user');
      } else {
        await awaitGetAIResponse(apiKey, undefined, undefined);
      }
    } finally {
      handleStopResponse();
    }
  };

  return (
    <StyledSendButton onClick={isAwaitingResponse ? handleStopResponse : handleGetAIResponse} disabled={disabled}>
      <FontAwesomeIcon icon={isAwaitingResponse ? faStop : faPaperPlane} />
    </StyledSendButton>
  );
};

export default SendButton;
