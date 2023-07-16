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

  const appendMessage = (content: string, role: string) => {
    setMessages((prev) => [...prev, { role, content }]);
    setConversations(prev => prev.map(item =>
      item === conversation ? {
        ...item,
        revisions: [{
          revision: '0',
          conversation: [...item.revisions[0].conversation, { role, content }]
        }]
      } : item
    ));
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

    console.log(model);
    return response;
  };

  const sendMessage = async (messageContent: string, role: string, apiKey: string, model: string) => {
    appendMessage(messageContent, role);
    
    // AIの応答を待つ間、空のメッセージを追加します。
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
    
const completion = await sendToOpenAI(messageContent, role, apiKey, model);

    const reader = completion.body?.getReader();
  
    if (completion.status !== 200 || !reader) {
      return;
    }
  
    const decoder = new TextDecoder('utf-8');
    let aiMessageContent = '';
  
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
              // 最新のAIのメッセージを更新します。
              setMessages(prev => prev.map((message, index) => index === prev.length - 1 ? { role: 'assistant', content: aiMessageContent } : message));
            }
          }
        }
        return read();
      };
      await read();
      console.log(messages);
    } catch (e) {
      console.error(e);
    }
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
