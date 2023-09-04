//firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ConversationType, SystemPromptType, FetchedUserData } from '../Conversations/types/Conversations.types';
import {initializeAuth, browserLocalPersistence, browserPopupRedirectResolver} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: [browserLocalPersistence],
  popupRedirectResolver: browserPopupRedirectResolver,
});

const fetchUserData = async (userId?: string): Promise<FetchedUserData> => {
  if (!userId) return { conversations: [], systemPrompts: [] };

  const docRef = doc(firestore, 'UserData', userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const conversations = data?.conversations?.map((conversation: ConversationType) => ({ ...conversation, id: conversation.id })) || [];
    const systemPrompts = data?.systemPrompts?.map((systemPrompt: SystemPromptType) => ({ ...systemPrompt, id: systemPrompt.id })) || [];
    return { conversations, systemPrompts };
  } else {
    return { conversations: [], systemPrompts: [] };
  }
};

const ensureDocExists = async (docRef: any) => {
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    await setDoc(docRef, {});
  }
};

const updateConversations = async (userId?: string, conversations: ConversationType[] = []) => {
  if (!userId) return;

  const docRef = doc(firestore, 'UserData', userId);
  await ensureDocExists(docRef);

  await updateDoc(docRef, { conversations });
};

const deleteConversation = async (userId?: string, conversationId?: string) => {
  if (!userId || !conversationId) return;

  const docRef = doc(firestore, 'UserData', userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    if (!data || !data.conversations) return;

    const updatedConversations = data.conversations.filter((conversation: ConversationType) => conversation.id !== conversationId);

    await updateDoc(docRef, { conversations: updatedConversations });
  }
};

const updateSystemPrompts = async (userId?: string, systemprompts: SystemPromptType[] = []) => {
  if (!userId) return;

  const docRef = doc(firestore, 'UserData', userId);
  await ensureDocExists(docRef);

  await updateDoc(docRef, { systemPrompts: systemprompts });
};

export { auth, fetchUserData, updateConversations, deleteConversation, updateSystemPrompts };