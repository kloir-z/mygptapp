import React, { useEffect, useState, useRef } from 'react';
import MessageInput from './MessageInput';
import { ConversationType, ConversationData } from './Conversations.types';
import { getAIResponse, getAndSetTokenCount } from './openAIUtil';
import { Message, ConversationContainer, MessagesContainer, EditingText, OkCancelButton, InputContainer, EditTextarea } from './Conversation.styles'
import { StyledTextarea } from './MessageInput.styles'
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
  const [prevMessageCount, setPrevMessageCount] = useState<number>(messages.length);
  const [totalTokenUpdateRequired, setTotalTokenUpdateRequired] = useState(false);

  useEffect(() => {
    setMessages(conversation.revisions[0].conversation);
  }, [conversation]);
  
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
    messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: 'auto' });
  };

  useEffect(() => {
    if (messages.length !== prevMessageCount) {
      scrollToBottom();
      setPrevMessageCount(messages.length);
    }
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

  const onDoubleClickMessage = (index: number) => {
    setEditingMessageContent(messages[index]?.content || null);
    setEditingMessageIndex(index);
  };

  const handleContentChange = (index: number, newContent: string) => {
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages];
      updatedMessages[index].content = newContent;
      return updatedMessages;
    });
  };

  const handleCancelEditing = () => {
    if (editingMessageIndex !== null && editingMessageContent !== null) {
      handleContentChange(editingMessageIndex, editingMessageContent);
    }
    setEditingMessageIndex(null);
    setEditingMessageContent(null);
  };

  const editTextAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (editTextAreaRef.current && editingMessageIndex !== null) {
      const content = messages[editingMessageIndex]?.content;
      if (content) {
        editTextAreaRef.current.style.height = 'auto';
        editTextAreaRef.current.style.height = `${editTextAreaRef.current.scrollHeight}px`;
      }
    }
  }, [editingMessageIndex !== null ? messages[editingMessageIndex]?.content : '', editingMessageIndex]);

  useEffect(() => {
    setMessages(conversation.revisions[0].conversation);
    setEditingMessageIndex(null);
    setEditingMessageContent(null);
    setTotalTokenUpdateRequired(true);
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
                  value={message.content}
                  onChange={e => handleContentChange(index, e.target.value)}
                  rows={message.content.split('\n').length || 1}
                  ref={editTextAreaRef} 
                />
                <>
                  <EditingText>Editing...
                    <OkCancelButton onClick={() => setEditingMessageIndex(null)}>OK</OkCancelButton>
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
