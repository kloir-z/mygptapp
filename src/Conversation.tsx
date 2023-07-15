import React, { useState, useEffect } from 'react';
import MessageInput from './MessageInput';
import { Conversation as ConversationType } from './Conversations';
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

  useEffect(() => {
    setTitle(conversation.title);
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

  const addMessage = (content: string) => {
    setConversations(prev => {
      return prev.map(item => {
        if (item === conversation) {
          const newConversation = { ...item };
          const newMessage = {
            role: 'user',
            content,
          };
          newConversation.revisions[0].conversation = [...newConversation.revisions[0].conversation, newMessage];
          setActiveConversation(newConversation);  // 新しいアクティブな会話を設定
          return newConversation;
        }
        return item;
      });
    });
  };

  return (
    <div style={{ margin: '1rem', flex: 1 }}>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button onClick={handleRename}>Rename</button>
      <button onClick={handleDelete}>Delete</button>
      {conversation.revisions[0].conversation.map((item, index) => (
        <pre key={index} style={{ backgroundColor: getColor(item.role) }}>
          {item.content}
        </pre>
      ))}
      <MessageInput addMessage={addMessage} />
    </div>
  );
};

export default Conversation;
