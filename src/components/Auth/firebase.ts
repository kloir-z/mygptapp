//firebase.ts
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { ConversationType, SystemPromptType, FetchedUserData } from '../Conversations/types/Conversations.types';

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

const fetchUserData = async (userId?: string): Promise<FetchedUserData> => {
  if (!userId) return { conversations: [], systemPrompts: [] };

  const docRef = firestore.collection("UserData").doc(userId);
  const doc = await docRef.get();
  const data = doc.data();

  const conversations = data?.conversations?.map((conversation: ConversationType) => ({ ...conversation, id: conversation.id })) || [];
  const systemPrompts = data?.systemPrompts?.map((systemPrompt: SystemPromptType) => ({ ...systemPrompt, id: systemPrompt.id })) || [];

  return { conversations, systemPrompts };
};


const ensureDocExists = async (docRef: firebase.firestore.DocumentReference) => {
  const doc = await docRef.get();
  if (!doc.exists) {
    await docRef.set({});
  }
};

const updateConversations = async (userId?: string, conversations: ConversationType[] = []) => {
  if (!userId) return;

  const docRef = firestore.collection("UserData").doc(userId);
  await ensureDocExists(docRef);

  await firestore.collection("UserData").doc(userId).update({
    conversations: conversations,
  });
};

const deleteConversation = async (userId?: string, conversationId?: string) => {
  if (!userId || !conversationId) return;

  const docRef = firestore.collection("UserData").doc(userId);
  const doc = await docRef.get();
  const data = doc.data();
  if (!data || !data.conversations) return;

  const updatedConversations = data.conversations.filter((conversation: ConversationType) => conversation.id !== conversationId);

  await docRef.update({
    conversations: updatedConversations,
  });
};

const updateSystemPrompts = async (userId?: string, systemprompts: SystemPromptType[] = []) => {
  if (!userId) return;

  const docRef = firestore.collection("UserData").doc(userId);
  await ensureDocExists(docRef);

  await firestore.collection("UserData").doc(userId).update({
    systemPrompts: systemprompts,
  });
};

export { firebase, fetchUserData, updateConversations, deleteConversation, updateSystemPrompts };

export default firebase; 