import React, { useState, } from 'react';
import Conversation from './Conversation';
import { v4 as uuidv4 } from 'uuid'; 

export type ConversationData = {
  role: string;
  content: string;
};

type RevisionData = {
  revision: string;
  conversation: ConversationData[];
};

export type Conversation = {
  id: string;  // 追加
  title: string;
  revisions: RevisionData[];
};

const Conversations: React.FC = () => {
  const initialConversations: Conversation[] = [
    {
      id: uuidv4(),
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
      id: uuidv4(),
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

  const changeConversation = (index: number) => {
    setActiveConversation(conversations[index]);
  };

  const createNewConversation = (): Conversation => {
    return {
      id: uuidv4(),
      title: "New Conversation",
      revisions: [
        {
          revision: "0",
          conversation: [
            {
              role: "system",
              content: "AI Assistant",
            },
          ],
        },
      ],
    };
  };

  return (
      <div style={{ display: 'flex' }}>
        <div style={{ margin: '1rem', width: '20%' }}>
          <button onClick={() => {
            const newConv = createNewConversation();
            setConversations(prev => [...prev, newConv]);
            setActiveConversation(newConv);
          }}>New</button>
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