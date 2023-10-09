//Conversations.types.ts
export type ConversationData = {
  role: string;
  content: string;
};

type RevisionData = {
  revision: string;
  conversation: ConversationData[];
};

export type ConversationType = {
  id: string;
  title: string;
  systemPromptTitle: string;
  revisions: RevisionData[];
};

export type SystemPromptType = {
  id: string;
  title: string;
  content: string;
};

export type FetchedUserData = {
  conversations: ConversationType[];
  systemPrompts: SystemPromptType[];
};

export type ModelOption = {
  value: string;
  label: string;
};