import React from 'react';
import { Conversation as ConversationType } from './Conversations';

export type ConversationData = {
  role: string;
  content: string;
};

export type RevisionData = {
  revision: string;
  conversation: ConversationData[];
};

export type Conversation = {
  title: string;
  revisions: RevisionData[];
};

export type ConversationProps = {
  conversation: ConversationType;
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[]>>;
  setActiveConversation: React.Dispatch<React.SetStateAction<ConversationType | null>>;
};