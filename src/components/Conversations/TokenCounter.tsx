//TokenCounter.tsx
import React, { useState, useEffect } from 'react';
import { getAndSetTokenCount } from '../../utils/tokenCounter';
import { ConversationData } from './types/Conversations.types';
import { InputTokenText, MessageTokenText } from './styles/MessageInput.styles'
import { FaCalculator } from 'react-icons/fa';
import { Spinner } from './Spinner'

type TokenCounterProps = {
  displayMessages: ConversationData[];
  model: string;
  totalTokenUpdateRequired: boolean;
  setTotalTokenUpdateRequired: React.Dispatch<React.SetStateAction<boolean>>;
  inputTokenUpdateRequired: boolean;
  setInputTokenUpdateRequired: React.Dispatch<React.SetStateAction<boolean>>;
  inputMessage: string;
};

const TokenCounter: React.FC<TokenCounterProps> = ({ displayMessages, model, totalTokenUpdateRequired, setTotalTokenUpdateRequired, inputTokenUpdateRequired, setInputTokenUpdateRequired, inputMessage }) => {
  const [inputTokenCount, setInputTokenCount] = useState<number>(0);
  const [totalTokenCount, setTotalTokenCount] = useState<number>(0);
  const [inputTokenLoading, setInputTokenLoading] = useState(false);
  const [totalTokenLoading, setTotalTokenLoading] = useState(false);

  const checkInputTokenCount = async () => {
    if (inputTokenUpdateRequired) {
      setInputTokenLoading(true);
      await getAndSetTokenCount([{ role: 'user', content: inputMessage }], setInputTokenCount);
      setInputTokenLoading(false);
      setInputTokenUpdateRequired(false);
    }
  };

  const checkMessageTokenCount = async () => {
    if (totalTokenUpdateRequired) {
      setTotalTokenLoading(true);
      await getAndSetTokenCount([...displayMessages], setTotalTokenCount);
      setTotalTokenLoading(false);
      setTotalTokenUpdateRequired(false);
    }
  };

  useEffect(() => {
    setInputTokenUpdateRequired(true);
  },[inputMessage]);

  useEffect(() => {
    setTotalTokenUpdateRequired(true);
  },[displayMessages]);

  return (
    <>
      {inputTokenLoading ? (
        <InputTokenText><Spinner /></InputTokenText>
      ) : (
        <InputTokenText onClick={checkInputTokenCount}>{inputTokenUpdateRequired ? <FaCalculator style={{padding: '3px'}} /> : inputTokenCount}</InputTokenText>
      )}
      {totalTokenLoading ? (
        <MessageTokenText><Spinner /></MessageTokenText>
      ) : (
        <MessageTokenText onClick={checkMessageTokenCount}>{totalTokenUpdateRequired ? <FaCalculator style={{padding: '3px'}} /> : totalTokenCount}</MessageTokenText>
      )}
    </>
  );
};

export default TokenCounter;
