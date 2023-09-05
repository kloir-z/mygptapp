//SendButton.tsx
import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faStop } from '@fortawesome/free-solid-svg-icons'
import { SendButton as StyledSendButton } from '../styles/MessageInput.styles'
import { Spinner } from "../Conversations/Spinner";

type SendButtonProps = {
  receivingId: string;
  awaitGetAIResponse: (inputMessage?: string) => Promise<void>;
  handleStartResponse: () => void;
  handleStopResponse: () => void;
  inputMessage?: string;
  setInputMessage?: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean; 
};

const SendButton: React.FC<SendButtonProps> = ({ receivingId, awaitGetAIResponse, handleStartResponse, handleStopResponse, inputMessage, setInputMessage, disabled }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleGetAIResponse = async () => {
    handleStartResponse();
    try {
      if (inputMessage && setInputMessage) {
        setInputMessage(''); 
        await awaitGetAIResponse(inputMessage);
      } else {
        await awaitGetAIResponse(undefined);
      }
    } finally {
      handleStopResponse();
    }
  };

  const onMouseEnter = () => {
    setIsHovered(true);
  };

  const onMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <StyledSendButton
      onClick={receivingId ? handleStopResponse : handleGetAIResponse}
      disabled={disabled}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {receivingId ? (
        isHovered ? (
          <FontAwesomeIcon icon={faStop} />
        ) : (
          <Spinner />
        )
      ) : (
        <FontAwesomeIcon icon={faPaperPlane} />
      )}
    </StyledSendButton>
  );
};

export default SendButton;
