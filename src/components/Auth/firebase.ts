import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { ConversationType, SystemPromptType, ConversationsResult } from '../Conversations/Conversations.types';

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

const fetchConversations = async (userId?: string): Promise<ConversationsResult | []> => {
  if (!userId) return [];

  const docRef = firestore.collection("conversations").doc(userId);
  const doc = await docRef.get();
  const data = doc.data();
  if (!data || !data.messages) {
    return [];
  }
  const systemPrompts: SystemPromptType[] = data.systemPrompt
    ? data.systemPrompt.map((systemPrompt: any) => ({ id: systemPrompt.id, ...systemPrompt }))
    : [];

  return {
    messages: data.messages.map((message: any) => ({ id: message.id, ...message })),
    systemPrompts
  };
};

const updateConversations = async (userId?: string, conversations: ConversationType[] = []) => {
  if (!userId) return;

  await firestore.collection("conversations").doc(userId).update({
    messages: conversations,
  });
};

const updateSystemPrompts = async (userId?: string, systemprompts: SystemPromptType[] = []) => {
  if (!userId) return;

  await firestore.collection("conversations").doc(userId).update({
    systemPrompt: systemprompts,
  });
};

export { firebase, fetchConversations, updateConversations, updateSystemPrompts };

export default firebase; 