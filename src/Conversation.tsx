import React, { useState, useEffect } from 'react';
import MessageInput from './MessageInput';
import { Conversation as ConversationType, ConversationData } from './Conversations';
import getColor from './getColor';

type ConversationProps = {
  conversation: ConversationType;
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[]>>;
  setActiveConversation: React.Dispatch<React.SetStateAction<ConversationType | null>>;
};

const Conversation: React.FC<ConversationProps> = ({
  conversation,
  setConversations,
  setActiveConversation,
}) => {
  const [title, setTitle] = useState(conversation.title);
  const [apiKey, setApiKey] = useState('');
  const [messages, setMessages] = useState<ConversationData[]>(conversation.revisions[0].conversation);

  useEffect(() => {
    setTitle(conversation.title);
    setMessages(conversation.revisions[0].conversation);
  }, [conversation]);
  
  const handleRename = () => {
    setConversations(prev => prev.map(item =>
      item === conversation ? { ...item, title } : item
    ));
  };

  const handleDelete = () => {
    setConversations(prev => prev.filter(item => item !== conversation));
    setActiveConversation(null);
  };

  const sendToOpenAI = async (messageContent: string, role: string, apiKey: string, model: string) => {
    const messageData = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));
    messageData.push({ role, content: messageContent });
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: messageData,
        stream: true
      })
    });

    return response;
  };

  const getAIResponse = async (messageContent: string, role: string, apiKey: string, model: string) => {
    setMessages(prev => [...prev, { role: 'user', content: messageContent }]);
    const response = await sendToOpenAI(messageContent, role, apiKey, model);
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body stream not available');
    }
  
    const decoder = new TextDecoder('utf-8');
    let aiMessageContent = '';
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
    let finalMessages = [...messages, { role: 'user', content: messageContent }, { role: 'assistant', content: '' }];

    try {
      const read = async (): Promise<void> => {
        const { done, value } = await reader.read();
        if (done) {
          reader.releaseLock();
          return;
        }

        const chunk = decoder.decode(value, { stream: true });
        const jsons = chunk
          .split('\n')
          .filter((data) => data.startsWith('data:') && !data.includes('[DONE]'))
          .map((data) => JSON.parse(data.slice(5)))
          .filter((data) => data);

        for (const json of jsons) {
          if (json.choices) {
            const aiMessageChunk = json.choices[0]?.delta.content;
            if (aiMessageChunk) {
              aiMessageContent += aiMessageChunk;
              setMessages(prev => prev.map((message, index) => index === prev.length - 1 ? { role: 'assistant', content: aiMessageContent } : message));
            }
          }
        }
        return read();
      };
      await read();
    } catch (e) {
      console.error(e);
    }
  
    finalMessages = finalMessages.map((message, index) => 
      index === finalMessages.length - 1 ? { role: 'assistant', content: aiMessageContent } : message
    );
    return finalMessages;
  };
  
  const sendMessage = async (messageContent: string, role: string, apiKey: string, model: string) => {
    const finalMessages = await getAIResponse(messageContent, role, apiKey, model);
    console.log('finalMessages');
    console.log(finalMessages);
    console.log('conversation');
    console.log(conversation);
  
    setConversations(prev => prev.map(item => {
      if (item.id === conversation.id) {
        return {
          ...item,
          revisions: [{
            revision: '0',
            conversation: finalMessages
          }]
        };
      } else {
        return item;
      }
      }));
  };

  return (
    <div style={{ margin: '1rem', flex: 1 }}>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button onClick={handleRename}>Rename</button>
      <button onClick={handleDelete}>Delete</button>
      <input value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="API Key" />
      {messages.map((message: ConversationData, index: number) => (
        <div key={index} style={{backgroundColor: getColor(message.role), padding: '10px', margin: '5px 0', textAlign: 'left'}}>
          <strong>{message.role}: </strong> {message.content}
        </div>
      ))}
      <MessageInput sendMessage={sendMessage} apiKey={apiKey} />
    </div>
  );
};

export default Conversation;