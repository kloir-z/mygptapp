//tokenCounter.ts
import { Tiktoken } from "@dqbd/tiktoken/lite";
import cl100k_base from "@dqbd/tiktoken/encoders/cl100k_base.json";
import { ConversationData } from "src/components/types/Conversations.types";

const countTokens = (messages: ConversationData[]): number => {
  const encoding = new Tiktoken(
    cl100k_base.bpe_ranks,
    cl100k_base.special_tokens,
    cl100k_base.pat_str
  );

  let totalTokens = 0;
  messages.forEach((message) => {
    const tokens = encoding.encode(message.content);
    totalTokens += tokens.length;
    const roleTokens = encoding.encode(message.role);
    totalTokens += roleTokens.length;
  });

  encoding.free();
  return totalTokens;
};

export const getAndSetTokenCount = async (messages: ConversationData[], setTokenCount: React.Dispatch<React.SetStateAction<number>>) => {
  const tokenCount = await countTokens(messages);
  setTokenCount(tokenCount);
};