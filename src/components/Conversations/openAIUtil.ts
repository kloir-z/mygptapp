import { ConversationData } from "./Conversations";

const sendToOpenAI = async (messageContent: string, role: string, apiKey: string, model: string, messages: ConversationData[]) => {
  const messageData = messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
  messageData.push({ role, content: messageContent });
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: messageData,
      stream: true
    })
  });
  return response;
};

export const getAIResponse = async (messageContent: string, role: string, apiKey: string, model: string, messages: ConversationData[], setMessages: React.Dispatch<React.SetStateAction<ConversationData[]>>) => {
  setMessages(prev => [...prev, { role: 'user', content: messageContent }]);
  const response = await sendToOpenAI(messageContent, role, apiKey, model, messages);
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body stream not available');
  }

  const decoder = new TextDecoder('utf-8');
  let aiMessageContent = '';
  setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

  try {
    const read = async (): Promise<void> => {
      const { done, value } = await reader.read();
      if (done) {
        reader.releaseLock();
        return;
      }

      const chunk = decoder.decode(value, { stream: true });
      const jsons = chunk
        .split('\n')
        .filter((data) => data.startsWith('data:') && !data.includes('[DONE]'))
        .map((data) => JSON.parse(data.slice(5)))
        .filter((data) => data);

      for (const json of jsons) {
        if (json.choices) {
          const aiMessageChunk = json.choices[0]?.delta.content;
          if (aiMessageChunk) {
            aiMessageContent += aiMessageChunk;
            setMessages(prev => prev.map((message, index) => index === prev.length - 1 ? { role: 'assistant', content: aiMessageContent } : message));
          }
        }
      }
      return read();
    };
    await read();
  } catch (e) {
    console.error(e);
  }
  let finalMessages = [...messages, { role: 'user', content: messageContent }, { role: 'assistant', content: aiMessageContent }];
  return finalMessages;
};

const countTokens = async (messages: ConversationData[], model: string): Promise<number> => {
  const url = 'https://us-central1-my-pj-20230703.cloudfunctions.net/count_tokens';
  const data = {
    messages,
    model
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const json = await response.json();
  return json['num_tokens'];
};

export const getAndSetTokenCount = async (messages: ConversationData[], model: string, setTokenCount: React.Dispatch<React.SetStateAction<number>>) => {
  const tokenCount = await countTokens(messages, model);
  setTokenCount(tokenCount);
};