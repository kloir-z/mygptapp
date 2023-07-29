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
  revisions: RevisionData[];
};
