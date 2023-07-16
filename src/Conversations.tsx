import React, { useState } from 'react';
import Conversation from './Conversation';

export type ConversationData = {
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

const Conversations: React.FC = () => {
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
              content: "test",
            },
            {
              role: "assistant",
              content: "test?",
            },
          ],
        },
      ],
    },
    {
      title: "test conversation",
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
              content: "tests",
            },
            {
              role: "assistant",
              content: "hello, test?",
            },
          ],
        },
      ],
    },
  ];

  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  const deleteConversation = (index: number) => {
    const newConversations = [...conversations];
    newConversations.splice(index, 1);
    setConversations(newConversations);
    if (activeConversation === conversations[index]) {
      setActiveConversation(newConversations[0] || null);
    }
  };

  const changeConversation = (index: number) => {
    setActiveConversation(conversations[index]);
  };

  return (
      <div style={{ display: 'flex' }}>
        <div style={{ margin: '1rem', width: '20%' }}>
          {conversations.map((conversation, index) => (
            <div 
              key={index} 
              onClick={() => changeConversation(index)}
              style={{backgroundColor: 'lightgrey', padding: '10px', margin: '5px 0', cursor: 'pointer'}}
            >
              {conversation.title}
            </div>
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
