//firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, deleteDoc, setDoc  } from 'firebase/firestore';
import { ConversationType, SystemPromptType, FetchedUserData } from '../../types/Conversations.types';
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

  let conversations: ConversationType[] = [];
  let systemPrompts: SystemPromptType[] = [];

  let i = 0;
  while (true) {
    const docRef = doc(firestore, 'UserData', `${userId}-conversations-${i}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      conversations = conversations.concat(docSnap.data()?.conversations ?? []);
    } else {
      if (i === 0) {
        await setDoc(docRef, { conversations: [] });
      }
      break;
    }
    i++;
  }

  let j = 0;
  while (true) {
    const docRef = doc(firestore, 'UserData', `${userId}-systemPrompts-${j}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      systemPrompts = systemPrompts.concat(docSnap.data()?.systemPrompts ?? []);
    } else {
      if (j === 0) {
        await setDoc(docRef, { systemPrompts: [] });
      }
      break;
    }
    j++;
  }

  return { conversations, systemPrompts };
};

const updateConversations = async (userId?: string, conversations: ConversationType[] = []) => {
  if (!userId) return;

  let start = 0;
  let i = 0;
  const limit = 500000;
  while (start < conversations.length) {
    const [chunk, nextStart] = getChunk(conversations, start, limit);
    const chunkSize = JSON.stringify({ conversations: chunk }).length;

    if (chunkSize >= limit) {
      console.error('Chunk size is close to or exceeds the limit!');
      return;
    }

    const docRef = doc(firestore, 'UserData', `${userId}-conversations-${i}`);
    await setDoc(docRef, { conversations: chunk });
    start = nextStart;
    i++;
    await deleteUnusedDocs(userId!, i - 1, 'conversations');
  }
};

const updateSystemPrompts = async (userId?: string, systemPrompts: SystemPromptType[] = []) => {
  if (!userId) return;

  let start = 0;
  let i = 0;
  const limit = 500000;
  while (start < systemPrompts.length) {
    const [chunk, nextStart] = getChunk(systemPrompts, start, limit);
    const chunkSize = JSON.stringify({ systemPrompts: chunk }).length;

    if (chunkSize >= limit) {
      console.error('Chunk size is close to or exceeds the limit!');
      return;
    }

    const docRef = doc(firestore, 'UserData', `${userId}-systemPrompts-${i}`);
    await setDoc(docRef, { systemPrompts: chunk });
    start = nextStart;
    i++;
    await deleteUnusedDocs(userId!, i - 1, 'systemPrompts');
  }
};

const deleteConversation = async (userId?: string, conversationId?: string) => {
  if (!userId || !conversationId) return;

  let conversations: ConversationType[] = [];
  
  let i = 0;
  while (true) {
    const docRef = doc(firestore, 'UserData', `${userId}-conversations-${i}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      conversations = conversations.concat(docSnap.data()?.conversations ?? []);
    } else {
      break;
    }
    i++;
  }

  const newConversations = conversations.filter((conv) => conv.id !== conversationId);

  await updateConversations(userId, newConversations);
};

const deleteUnusedDocs = async (userId: string, lastUsedIndex: number, collectionType: 'conversations' | 'systemPrompts') => {
  let i = lastUsedIndex + 1;
  while (true) {
    const docRef = doc(firestore, 'UserData', `${userId}-${collectionType}-${i}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await deleteDoc(docRef);
    } else {
      break;
    }
    i++;
  }
};

const getChunk = <T>(array: T[], start: number, limit: number): [T[], number] => {
  let size = 0;
  let end = start;

  while (end < array.length) {
    // JSON.stringifyを使っておおよそのサイズを計算。これは完全ではありませんが、近似値としては有用です。
    size += JSON.stringify(array[end]).length;
    if (size > limit) break;
    end++;
  }

  return [array.slice(start, end), end];
};

export { auth, fetchUserData, updateConversations, deleteConversation, updateSystemPrompts };