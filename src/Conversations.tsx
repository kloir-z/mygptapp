import React, { useEffect, useState, useContext } from 'react';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { AuthContext } from './AuthContext';
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
  id: string;
  title: string;
  revisions: RevisionData[];
};

const Conversations: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    // handle the case when authContext is not available
    // for example, return null or some placeholder
    return null;
  }

  const { user } = authContext;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      const firestore = firebase.firestore();
      const docRef = firestore.collection("conversations").doc(user?.uid);
      const doc = await docRef.get();
      const data = doc.data();
      if (!data || !data.messages) {
        return;
      }
      const conversations: Conversation[] = data.messages.map((message: any) => ({id: message.id, ...message} as Conversation));
      setConversations(conversations);
      console.log(conversations);
    };

    fetchConversations();
  }, [user?.uid]);

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
          ],
        },
      ],
    };
  };
  
  const handleMessageSend = async (updatedConversation: Conversation) => {
    const updatedConversations = conversations.map(item => 
      item.id === updatedConversation.id ? updatedConversation : item
    );

    // Update Firebase Firestore and wait for the write to finish
    const firestore = firebase.firestore();
    await firestore.collection("conversations").doc(user?.uid).set({
      messages: updatedConversations
    });

    // After Firestore update, update local state
    setConversations(updatedConversations);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ margin: '1rem', width: '20%' }}>
        <button onClick={() => {
          const newConv = createNewConversation();
          setConversations(prev => [...prev, newConv]);
          setActiveConversation(newConv);
        }}>New</button>
        <input 
          value={activeConversation?.title || ''} 
          onChange={(e) => {
            if(activeConversation) {
              const newTitle = e.target.value;
              setActiveConversation(prev => prev ? {...prev, title: newTitle} : null);
            }
          }}
        />
        <button onClick={() => {
          if(activeConversation) {
            setConversations(prev => prev.map(conv => 
              conv.id === activeConversation.id ? {...conv, title: activeConversation.title} : conv
            ));
          }
        }}>Rename</button>
        <button onClick={() => {
          if(activeConversation) {
            setConversations(prev => prev.filter(conv => conv.id !== activeConversation.id));
            setActiveConversation(null);
          }
        }}>Delete</button>
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
      {activeConversation ? (
        <Conversation
          conversation={activeConversation}
          setConversations={setConversations}
          setActiveConversation={setActiveConversation}
          sendMessage={handleMessageSend}
        />
      ) : (
        <div style={{ margin: '1rem', flex: 1 }}>Please select a conversation</div>
      )}
    </div>
  );
};

export default Conversations;