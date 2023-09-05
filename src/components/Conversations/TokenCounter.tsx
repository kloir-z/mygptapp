//TokenCounter.tsx
import React, { useState, useEffect } from 'react';
import { getAndSetTokenCount } from '../../utils/tokenCounter';
import { ConversationType } from './types/Conversations.types';
import { TokenText } from '../styles/Topbar.styles'
import { FaCalculator } from 'react-icons/fa';
import { Spinner } from './Spinner'

type TokenCounterProps = {
  inputTokenCount: number;
  setInputTokenCount: React.Dispatch<React.SetStateAction<number>>;
  totalTokenCount: number;
  setTotalTokenCount: React.Dispatch<React.SetStateAction<number>>;
  conversations: ConversationType[] | [];
  activeConversation: ConversationType | null;
  totalTokenUpdateRequired: boolean;
  setTotalTokenUpdateRequired: React.Dispatch<React.SetStateAction<boolean>>;
  inputTokenUpdateRequired: boolean;
  setInputTokenUpdateRequired: React.Dispatch<React.SetStateAction<boolean>>;
  inputMessage: string;
};

const TokenCounter: React.FC<TokenCounterProps> = ({
  inputTokenCount,
  setInputTokenCount,
  totalTokenCount,
  setTotalTokenCount,
  conversations,
  activeConversation,
  totalTokenUpdateRequired,
  setTotalTokenUpdateRequired,
  inputTokenUpdateRequired,
  setInputTokenUpdateRequired,
  inputMessage,
}) => {
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
    if (activeConversation) {
      setTotalTokenLoading(true);
      await getAndSetTokenCount([...activeConversation.revisions[0].conversation], setTotalTokenCount);
      setTotalTokenLoading(false);
    }
  };

  useEffect(() => {
    setInputTokenUpdateRequired(true);
  },[inputMessage]);

  useEffect(() => {
    checkMessageTokenCount()
  },[conversations, activeConversation]);

  return (
    <>
      {totalTokenLoading ? (
        <TokenText><Spinner /></TokenText>
      ) : (
        <TokenText onClick={checkMessageTokenCount}>{totalTokenUpdateRequired ? <FaCalculator style={{padding: '3px'}} /> : totalTokenCount}</TokenText>
      )}
      {inputTokenLoading ? (
        <TokenText><Spinner /></TokenText>
      ) : (
        <TokenText onClick={checkInputTokenCount}>{inputTokenUpdateRequired ? <FaCalculator style={{padding: '3px'}} /> : inputTokenCount}</TokenText>
      )}
    </>
  );
};

export default TokenCounter;