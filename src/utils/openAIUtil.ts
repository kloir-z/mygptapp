//openAIUtils.ts
import { ConversationData } from '../components/Conversations/types/Conversations.types';

type SendToOpenAIProps = {
  apiKey: string,
  model: string,
  messages: ConversationData[]
};

const sendToOpenAI = async ({ apiKey, model, messages }: SendToOpenAIProps) => {
  let messageData = messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));

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

type GetAIResponseProps = {
  apiKey: string,
  model: string,
  messages: ConversationData[],
  stopReceiving: React.MutableRefObject<boolean>,
  setReceivingMessage: React.Dispatch<React.SetStateAction<string>>
};

export const getAIResponse = async ({
  apiKey,
  model,
  messages,
  stopReceiving,
  setReceivingMessage
}: GetAIResponseProps): Promise<string> => {
  const response = await sendToOpenAI({ apiKey, model, messages });
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body stream not available');
  }

  const decoder = new TextDecoder('utf-8');
  let aiMessageContent = '';

  try {
    let retries = 3;
    const read = async (): Promise<void> => {
      if (stopReceiving.current) {
        reader.cancel();
        return;
      }
  
      try {
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
            if (typeof aiMessageChunk === 'string') {
              aiMessageContent += aiMessageChunk;
              setReceivingMessage(aiMessageContent);
            }
          }
        }
        return read();
      } catch (error) {
        console.error('An error occurred:', error);

        if (retries > 0) {
          retries--;
          console.log(`Retrying... ${retries} retries left.`);
          return read();
        } else {
          console.log('No more retries, canceling.');
          console.error(error);
          reader.cancel();
          throw error;
        }
      }
    };
    await read();
  } catch (e) {
    console.log('streaming error');
    console.error(e);
    return aiMessageContent;
  }
  return aiMessageContent;
};

export const getYoutubeTranscript = async (youtubeUrl: string): Promise<string | null> => {
  const endpoint = "https://asia-northeast2-my-pj-20230703.cloudfunctions.net/get_ytb_trans";
  const params = { url: youtubeUrl };

  try {
    const response = await fetch(`${endpoint}?url=${params.url}`);

    if (response.status === 200) {
      const data = await response.json();
      return data['transcript'];
    } else {
      return `Error: ${response.status}, ${response.statusText}`;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
