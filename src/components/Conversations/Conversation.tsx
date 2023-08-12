import React, { useEffect, useState, useRef } from 'react';
import MessageInput from './MessageInput';
import { ConversationType, ConversationData, SystemPromptType } from './Conversations.types';
import { getAIResponse, getAndSetTokenCount, getYoutubeTranscript } from './openAIUtil';
import { Message, ConversationContainer, MessagesContainer, EditingText, InputContainer, EditTextarea, StyledSelect, StyledOption, StyledButton, StyledInput } from './Conversation.styles'
import { SyntaxHighlight } from './SyntaxHighlight'
import { Spinner } from './Sppiner'
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

type ConversationProps = {
  conversation: ConversationType;
  model: string;
  apiKey: string;
  sendMessage: (updatedConversation: ConversationType) => Promise<void>;
  forwardedRef: React.RefObject<HTMLDivElement>;
  systemprompts: SystemPromptType[];
  receivingId: string;
  setReceivingId: React.Dispatch<React.SetStateAction<string>>;
};

const Conversation: React.FC<ConversationProps> = ({ forwardedRef, conversation, model, apiKey, sendMessage, systemprompts, receivingId, setReceivingId }) => {
  const [messages, setMessages] = useState<ConversationData[]>(conversation.revisions[0].conversation);
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);
  const [totalTokenUpdateRequired, setTotalTokenUpdateRequired] = useState(false);
  const [tempMessageContent, setTempMessageContent] = useState<string | null>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [showTranscriptPopup, setShowTranscriptPopup] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const stopReceiving = useRef(false); 

  const awaitGetAIResponse = async (messageContent: string, role: string, apiKey: string): Promise<void> => {
    stopReceiving.current = false
    setReceivingId(conversation.id)
    const finalMessages = await getAIResponse(messageContent, role, apiKey, model, messages, setMessages, stopReceiving);
    setReceivingId('')
    stopReceiving.current = false
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

  const handleStopReceiving = () => {
    stopReceiving.current = true
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

  const onDoubleClickMessage = (index: number) => {
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

  const showInitialMenu = () => {
    return !messages.some(message => message.role === 'assistant');
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
    setTotalTokenUpdateRequired(true);
  };
  
  type SystemPromptActions = {
    [key: string]: () => void;
  };

  const systemPromptActions: SystemPromptActions = {
    '日本語要約': () => { if (!messages.some(message => message.role === 'user')) setShowTranscriptPopup(true); },
    '英語要約': () => { if (!messages.some(message => message.role === 'user')) setShowTranscriptPopup(true); }
    // 今後他のプロンプトと機能をここに追加
  };

  const handleSystemPromptSelection = (selectedPromptId: string) => {
    if (selectedPromptId === 'none') {
      if (messages[0]?.role === 'system') {
        setMessages(prevMessages => prevMessages.slice(1));
      }
      setShowTranscriptPopup(false);
      return;
    }
  
  const selectedPrompt = systemprompts.find(prompt => prompt.id === selectedPromptId);
    if (selectedPrompt) {
      const action = systemPromptActions[selectedPrompt.title];
      if (action) {
        action();
      } else {
        setShowTranscriptPopup(false);
      }
  
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        if (updatedMessages[0]?.role === 'system') {
          updatedMessages[0] = { content: selectedPrompt.content, role: 'system' };
        } else {
          updatedMessages.unshift({ content: selectedPrompt.content, role: 'system' });
        }
        return updatedMessages;
      });
    }
  };
  
  const handleGetYtbTranscript = async () => {
    if (youtubeUrl) {
      setLoadingTranscript(true);
      const transcript = await getYoutubeTranscript(youtubeUrl);
      if (transcript) {
        setMessages(prevMessages => [
          ...prevMessages,
          { content: transcript, role: 'user' }
        ]);
          const updatedConversation = {
          ...conversation,
          revisions: [{
            revision: '0',
            conversation: messages.concat({ content: transcript, role: 'user' })
          }]
        };
        setLoadingTranscript(false);
        sendMessage(updatedConversation);
      }
    }
  };
  
  return (
    <ConversationContainer>
      <MessagesContainer ref={forwardedRef}>
        {showInitialMenu() && (
          <>
            <StyledSelect onChange={e => handleSystemPromptSelection(e.target.value)}>
              <StyledOption value="none">None</StyledOption>
              {systemprompts.map(prompt => (
                <StyledOption key={prompt.id} value={prompt.id}>{prompt.title}</StyledOption>
              ))}
            </StyledSelect>
            {showTranscriptPopup && (
              <>
                <StyledInput type="text" placeholder="YouTube URL" onChange={e => setYoutubeUrl(e.target.value)} />
                <StyledButton onClick={handleGetYtbTranscript}>OK</StyledButton>
              </>
            )}
          </>
        )}
        {messages.map((message: ConversationData, index: number) => {
  console.log('index:', index, 'receivingId:', receivingId, 'conversation.id:', conversation.id);
          if (index === messages.length - 1 && receivingId !== '' && conversation.id !== receivingId) {
            return null;
          }

          return (
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
                    <FaCheck className="Icon" style={{color:'green'}} onClick={() => handleConfirmEditing(index)}/>
                    <FaTimes className="Icon" style={{color:'red'}} onClick={handleCancelEditing}/>
                    <FaTrash className="Icon" style={{color:'#404040'}} onClick={() => deleteMessage(index)}/>
                  </EditingText>
                </>
              </>
            ) : (
              SyntaxHighlight(message.content)
            )}
          </Message>
          );
        })}
        {loadingTranscript && <Spinner />}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer>
        <MessageInput 
          awaitGetAIResponse={awaitGetAIResponse} 
          apiKey={apiKey} 
          getAndSetTokenCount={getAndSetTokenCount} 
          messages={messages} 
          model={model}
          totalTokenUpdateRequired={totalTokenUpdateRequired}
          setTotalTokenUpdateRequired={setTotalTokenUpdateRequired}
          handleStopReceiving={handleStopReceiving}
        />
      </InputContainer>
    </ConversationContainer>
  );
};

export default Conversation;
