import React, { useState } from 'react';
import Conversation from './Conversation';

// データの型定義
type ConversationData = {
  role: string;
  content: string;
};

type RevisionData = {
  revision: string;
  conversation: ConversationData[];
};

export type Conversation = {
  title: string;
  revisions: RevisionData[];
};

// Conversationsコンポーネント
const Conversations: React.FC = () => {
  // 初期データ
  const initialConversations: Conversation[] = [
    {
      title: "Sample Conversation",
      revisions: [
        {
          revision: "0",
          conversation: [
            {
              role: "system",
              content: "AI Assistant",
            },
            {
              role: "user",
              content: "通常の会話test",
            },
            {
              role: "assistant",
              content: "こんにちは、どうしましたか？test",
            },
          ],
        },
      ],
    },
    {
      title: "テスト会話",
      revisions: [
        {
          revision: "0",
          conversation: [
            {
              role: "system",
              content: "AI Assistant",
            },
            {
              role: "user",
              content: "てすと",
            },
            {
              role: "assistant",
              content: "こんにちは、テストですか？",
            },
          ],
        },
      ],
    },
  ];

  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);


  // コンポーネントの削除
  const deleteConversation = (index: number) => {
    const newConversations = [...conversations];
    newConversations.splice(index, 1);
    setConversations(newConversations);
    if (activeConversation === conversations[index]) {
      setActiveConversation(newConversations[0] || null);
    }
  };

  // アクティブな会話の切り替え
  const changeConversation = (index: number) => {
    setActiveConversation(conversations[index]);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ margin: '1rem', width: '20%' }}>
        {conversations.map((conversation, index) => (
          <button key={index} onClick={() => changeConversation(index)}>
            {conversation.title}
          </button>
        ))}
      </div>
      {activeConversation && (
        <Conversation
          conversation={activeConversation}
          setConversations={setConversations}
          setActiveConversation={setActiveConversation}
        />
      )}
    </div>
  );
};

export default Conversations;
