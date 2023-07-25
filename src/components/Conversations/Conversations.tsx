import React, { useEffect, useState, useContext } from 'react';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { AuthContext } from '../Auth/AuthContext';
import Conversation from './Conversation';
import { v4 as uuidv4 } from 'uuid'; 
import styled from '@emotion/styled';

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

const ConversationWrapper = styled.div`
  display: flex;
`;

const Sidebar = styled.div`
  margin: 1rem;
  width: 150px;
`;

const ConversationItem = styled.div`
  font-family: MairyoUI;
  font-size: 0.8rem;
  background-color: lightgrey; 
  padding: 10px; 
  margin: 5px 0; 
  cursor: pointer;
`;

const StyledButton = styled.button`
  // Add your styles here
`;

const StyledInput = styled.input`
  // Add your styles here
`;

const Placeholder = styled.div`
  margin: 1rem;
  flex: 1;
`;

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
    <ConversationWrapper>
      <Sidebar>
        <StyledButton onClick={() => {
          const newConv = createNewConversation();
          setConversations(prev => [...prev, newConv]);
          setActiveConversation(newConv);
        }}>New</StyledButton>
        <StyledInput 
          value={activeConversation?.title || ''} 
          onChange={(e) => {
            if(activeConversation) {
              const newTitle = e.target.value;
              setActiveConversation(prev => prev ? {...prev, title: newTitle} : null);
            }
          }}
        />
        <StyledButton onClick={() => {
          if(activeConversation) {
            setConversations(prev => prev.map(conv => 
              conv.id === activeConversation.id ? {...conv, title: activeConversation.title} : conv
            ));
          }
        }}>Rename</StyledButton>
        <StyledButton onClick={() => {
          if(activeConversation) {
            setConversations(prev => prev.filter(conv => conv.id !== activeConversation.id));
            setActiveConversation(null);
          }
        }}>Delete</StyledButton>
        {conversations.map((conversation, index) => (
          <ConversationItem 
            key={index} 
            onClick={() => changeConversation(index)}
          >
            {conversation.title}
          </ConversationItem>
        ))}
      </Sidebar>
      {activeConversation ? (
        <Conversation
          conversation={activeConversation}
          setConversations={setConversations}
          setActiveConversation={setActiveConversation}
          sendMessage={handleMessageSend}
        />
      ) : (
        <Placeholder>Please select a conversation</Placeholder>
      )}
    </ConversationWrapper>
  );
};

export default Conversations;