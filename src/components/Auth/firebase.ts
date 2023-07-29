import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { ConversationType, ConversationData } from '../Conversations/Conversations.types';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

const fetchConversations = async (userId?: string) => {
  if (!userId) return [];

  const docRef = firestore.collection("conversations").doc(userId);
  const doc = await docRef.get();
  const data = doc.data();
  if (!data || !data.messages) {
    return [];
  }

  return data.messages.map((message: any) => ({ id: message.id, ...message }));
};

const updateConversations = async (userId?: string, conversations: ConversationType[] = []) => {
  if (!userId) return;

  await firestore.collection("conversations").doc(userId).set({
    messages: conversations,
  });
};


export { firebase, fetchConversations, updateConversations };

export default firebase; 