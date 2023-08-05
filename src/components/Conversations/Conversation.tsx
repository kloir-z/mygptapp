import React, { useEffect, useState, useRef } from 'react';
import MessageInput from './MessageInput';
import { ConversationType, ConversationData } from './Conversations.types';
import { getAIResponse, getAndSetTokenCount } from './openAIUtil';
import { Message, ConversationContainer, MessagesContainer, InputContainer } from './Conversation.styles'
import { PrismLight as SyntaxHighlighter, Prism as SyntaxHighlighterPrism } from 'react-syntax-highlighter';
import syntaxStyle from 'react-syntax-highlighter/dist/cjs/styles/prism/one-dark';

import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';

SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('css', css);

type ConversationProps = {
  conversation: ConversationType;
  model: string;
  apiKey: string;
  sendMessage: (updatedConversation: ConversationType) => Promise<void>;
  forwardedRef: React.RefObject<HTMLDivElement>;
};

const Conversation: React.FC<ConversationProps> = ({ forwardedRef, conversation, model, apiKey, sendMessage}) => {
  const [messages, setMessages] = useState<ConversationData[]>(conversation.revisions[0].conversation);

  useEffect(() => {
    setMessages(conversation.revisions[0].conversation);
  }, [conversation, model]);
  
  const updateConversation  = async (messageContent: string, role: string, apiKey: string) => { 
    const finalMessages = await getAIResponse(messageContent, role, apiKey, model, messages, setMessages); 
    const updatedConversation = {
      ...conversation,
      revisions: [{
        revision: '0',
        conversation: finalMessages
      }]
    };
    sendMessage(updatedConversation);
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: 'auto' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const splitContent = (content: string) => {
    const codeRegex = /```(\w+)?\n([^`]+)```/g;
    const parts = [];
    let lastIndex = 0;
  
    let match;
    while ((match = codeRegex.exec(content)) !== null) {
      parts.push(<span key={lastIndex}>{content.slice(lastIndex, match.index)}</span>);
      const language = match[1] || 'javascript';
      parts.push(
        <SyntaxHighlighter
          language={language}
          style={syntaxStyle}
        >
          {match[2]}
        </SyntaxHighlighter>
      );
      lastIndex = match.index + match[0].length;
    }
    parts.push(<span key={lastIndex + 1}>{content.slice(lastIndex)}</span>);
  
    return parts;
  };

  return (
    <ConversationContainer>
      <MessagesContainer ref={forwardedRef}>
      {messages.map((message: ConversationData, index: number) => (
        <Message key={index} role={message.role}>
          {splitContent(message.content)}
        </Message>
      ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer>
        <MessageInput 
          sendMessage={updateConversation} 
          apiKey={apiKey} 
          getAndSetTokenCount={getAndSetTokenCount} 
          messages={messages} 
          model={model}
        />
      </InputContainer>
    </ConversationContainer>
  );
};

export default Conversation;
