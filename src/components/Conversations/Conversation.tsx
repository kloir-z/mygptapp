import React, { useEffect, useState, useRef } from 'react';
import MessageInput from './MessageInput';
import { ConversationType, ConversationData } from './Conversations.types';
import { getAIResponse, getAndSetTokenCount } from './openAIUtil';
import { Message, ConversationContainer, MessagesContainer, EditingText, OkCancelButton, InputContainer, EditTextarea } from './Conversation.styles'
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

const Conversation: React.FC<ConversationProps> = ({ forwardedRef, conversation, model, apiKey, sendMessage }) => {
  const [messages, setMessages] = useState<ConversationData[]>(conversation.revisions[0].conversation);
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);
  const [editingMessageContent, setEditingMessageContent] = useState<string | null>(null);
  const [totalTokenUpdateRequired, setTotalTokenUpdateRequired] = useState(false);
  const [tempMessageContent, setTempMessageContent] = useState<string | null>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  
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
    setTotalTokenUpdateRequired(true);
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: 'auto' });
    }, 0);
  };

  useEffect(() => {
    if (forwardedRef.current) {
      setContainerHeight(forwardedRef.current.scrollHeight);
    }
  }, [messages]);

  useEffect(() => {
    if (forwardedRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = forwardedRef.current;
      const isWithin50pxFromBottom = (scrollHeight - scrollTop - clientHeight) <= 50;
  
      if (isWithin50pxFromBottom) {
        scrollToBottom();
      }
    }
  }, [containerHeight]);

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

  const onDoubleClickMessage = (index: number) => {
    setEditingMessageContent(messages[index]?.content || null);
    setEditingMessageIndex(index);
    setTempMessageContent(messages[index]?.content || null);
  };

  const handleContentChange = (newContent: string) => {
    setTempMessageContent(newContent);
  };  

  const handleConfirmEditing = (index: number) => {
    if (tempMessageContent !== null) {
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        updatedMessages[index].content = tempMessageContent;
        return updatedMessages;
      });
    }
    setEditingMessageIndex(null);
    setTempMessageContent(null);
  };

  const handleCancelEditing = () => {
    setEditingMessageIndex(null);
    setTempMessageContent(null);
  };

  const editTextAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (editTextAreaRef.current && editingMessageIndex !== null) {
      const content = tempMessageContent;
      if (content) {
        editTextAreaRef.current.style.height = 'auto';
        editTextAreaRef.current.style.height = `${editTextAreaRef.current.scrollHeight}px`;
      }
    }
  }, [tempMessageContent, editingMessageIndex]);  

  useEffect(() => {
    setMessages(conversation.revisions[0].conversation);
    setEditingMessageIndex(null);
    setEditingMessageContent(null);
    setTotalTokenUpdateRequired(true);
    scrollToBottom();
  }, [conversation]);

  const deleteMessage = (index: number) => {
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages];
      updatedMessages.splice(index, 1);
      return updatedMessages;
    });
  
    const updatedConversation = {
      ...conversation,
      revisions: [{
        revision: '0',
        conversation: messages.filter((_, idx) => idx !== index)
      }]
    };
    sendMessage(updatedConversation);
    setEditingMessageIndex(null);
    setEditingMessageContent(null);
    setTotalTokenUpdateRequired(true);
  };

  return (
    <ConversationContainer>
      <MessagesContainer ref={forwardedRef}>
        {messages.map((message: ConversationData, index: number) => (
          <Message key={index} role={message.role} onDoubleClick={() => onDoubleClickMessage(index)}>
            {editingMessageIndex === index ? (
              <>
                <EditTextarea
                  value={tempMessageContent || ''}
                  onChange={e => handleContentChange(e.target.value)}
                  rows={tempMessageContent?.split('\n').length || 1}
                  ref={editTextAreaRef} 
                />
                <>
                  <EditingText>Editing...
                    <OkCancelButton onClick={() => handleConfirmEditing(index)}>OK</OkCancelButton>
                    <OkCancelButton onClick={handleCancelEditing}>Cancel</OkCancelButton>
                    <OkCancelButton onClick={() => deleteMessage(index)}>Delete</OkCancelButton>
                  </EditingText>
                </>
              </>
            ) : (
              splitContent(message.content)
            )}
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
          totalTokenUpdateRequired={totalTokenUpdateRequired}
          setTotalTokenUpdateRequired={setTotalTokenUpdateRequired}
        />
      </InputContainer>
    </ConversationContainer>
  );
};

export default Conversation;
