//firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocs, collection, getDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { ConversationType, SystemPromptType, FetchedUserData } from '../types/Conversations.types';
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

  await ensureDocExists(userId);

  const conversations = await getDocs(collection(firestore, `UserData/${userId}/conversations`));
  const systemPrompts = await getDocs(collection(firestore, `UserData/${userId}/systemPrompts`));

  return {
    conversations: conversations.docs.map(doc => doc.data() as ConversationType),
    systemPrompts: systemPrompts.docs.map(doc => doc.data() as SystemPromptType)
  };
};

const ensureDocExists = async (userId: string) => {
  const docRef = doc(firestore, 'UserData', userId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    await setDoc(docRef, {});
  }
};

const updateConversations = async (userId?: string, conversations: ConversationType[] = []) => {
  if (!userId) return;

  await ensureDocExists(userId);

  for (let i = 0; i < conversations.length; i++) {
    const conversation = conversations[i];
    if (!/^(\d{6}-).*/.test(conversation.id)) {
      const indexPadded = String(i).padStart(6, '0');
      conversation.id = `${indexPadded}-${conversation.id}`;
    }

    const docRef = doc(firestore, `UserData/${userId}/conversations/${conversation.id}`);
    await setDoc(docRef, conversation, { merge: true });
  }
};

const updateSystemPrompts = async (userId?: string, systemPrompts: SystemPromptType[] = []) => {
  if (!userId) return;

  await ensureDocExists(userId);

  for (let i = 0; i < systemPrompts.length; i++) {
    const systemPrompt = systemPrompts[i];
    if (!/^(\d{6}-).*/.test(systemPrompt.id)) {
      const indexPadded = String(i).padStart(6, '0');
      systemPrompt.id = `${indexPadded}-${systemPrompt.id}`;
    }

    const docRef = doc(firestore, `UserData/${userId}/systemPrompts/${systemPrompt.id}`);
    await setDoc(docRef, systemPrompt, { merge: true });
  }
};

const deleteConversation = async (userId?: string, conversationId?: string) => {
  if (!userId || !conversationId) return;

  await ensureDocExists(userId);

  const docRef = doc(firestore, `UserData/${userId}/conversations/${conversationId}`);
  await deleteDoc(docRef);
};

export { auth, fetchUserData, updateConversations, deleteConversation, updateSystemPrompts };