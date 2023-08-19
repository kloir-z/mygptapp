import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faStop } from '@fortawesome/free-solid-svg-icons'
import { SendButton as StyledSendButton } from './styles/MessageInput.styles'

type SendButtonProps = {
  isAwaitingResponse: boolean;
  awaitGetAIResponse: (message: string, role: string, apiKey: string) => Promise<void>;
  handleStartResponse: () => void;
  handleStopResponse: () => void;
  message: string;
  apiKey: string;
};

const SendButton: React.FC<SendButtonProps> = ({ isAwaitingResponse, awaitGetAIResponse, handleStartResponse, handleStopResponse, message, apiKey }) => {
  const handleGetAIResponse = async () => {
    if (message.trim() === '') {
      return;
    }
    handleStartResponse();
    try {
      await awaitGetAIResponse(message, 'user', apiKey);
    } finally {
      handleStopResponse();
    }
  };

  return (
    <StyledSendButton onClick={isAwaitingResponse ? handleStopResponse : handleGetAIResponse}>
      <FontAwesomeIcon icon={isAwaitingResponse ? faStop : faPaperPlane} />
    </StyledSendButton>
  );
};

export default SendButton;
