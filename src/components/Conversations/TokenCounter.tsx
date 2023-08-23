import React, { useState, useEffect } from 'react';
import { getAndSetTokenCount } from '../../utils/openAIUtil';
import { ConversationData } from './types/Conversations.types';
import { InputTokenText, MessageTokenText } from './styles/MessageInput.styles'
import { Spinner } from './Spinner'

type TokenCounterProps = {
  messages: ConversationData[];
  model: string;
  totalTokenUpdateRequired: boolean;
  setTotalTokenUpdateRequired: React.Dispatch<React.SetStateAction<boolean>>;
  inputTokenUpdateRequired: boolean;
  setInputTokenUpdateRequired: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
};

const TokenCounter: React.FC<TokenCounterProps> = ({ messages, model, totalTokenUpdateRequired, setTotalTokenUpdateRequired, inputTokenUpdateRequired, setInputTokenUpdateRequired, message }) => {
  const [inputTokenCount, setInputTokenCount] = useState<number>(0);
  const [totalTokenCount, setTotalTokenCount] = useState<number>(0);
  const [inputTokenLoading, setInputTokenLoading] = useState(false);
  const [totalTokenLoading, setTotalTokenLoading] = useState(false);

  const checkInputTokenCount = async () => {
    if (inputTokenUpdateRequired) {
      setInputTokenLoading(true);
      await getAndSetTokenCount([{ role: 'user', content: message }], model, setInputTokenCount);
      setInputTokenLoading(false);
      setInputTokenUpdateRequired(false);
    }
  };

  const checkMessageTokenCount = async () => {
    if (totalTokenUpdateRequired) {
      setTotalTokenLoading(true);
      await getAndSetTokenCount([...messages], model, setTotalTokenCount);
      setTotalTokenLoading(false);
      setTotalTokenUpdateRequired(false);
    }
  };

  useEffect(() => {
    if(!inputTokenUpdateRequired){
      setInputTokenUpdateRequired(true);
    }
  },[message]);

  useEffect(() => {
    if(!totalTokenUpdateRequired){
      setTotalTokenUpdateRequired(true);
    }
  },[messages]);

  return (
    <>
      {inputTokenLoading ? (
        <InputTokenText><Spinner /></InputTokenText>
      ) : (
        <InputTokenText onClick={checkInputTokenCount}>{inputTokenUpdateRequired ? '?' : inputTokenCount}</InputTokenText>
      )}
      {totalTokenLoading ? (
        <MessageTokenText><Spinner /></MessageTokenText>
      ) : (
        <MessageTokenText onClick={checkMessageTokenCount}>{totalTokenUpdateRequired ? '?' : totalTokenCount}</MessageTokenText>
      )}
    </>
  );
};

export default TokenCounter;
