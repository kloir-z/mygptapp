//openAIUtils.ts
import { ConversationData } from '../types/Conversations.types';
import debounce from 'lodash/debounce';

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

  const debouncedSetReceivingMessage = debounce(setReceivingMessage, 1);

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
          .map((data) => {
            try {
              return JSON.parse(data.slice(5));
            } catch (e) {
              console.error("JSON parse error:", e, "Data:", data);
              return null;
            }
          })
          .filter((data) => data);

        for (const json of jsons) {
          if (json.choices) {
            const aiMessageChunk = json.choices[0]?.delta.content;
            if (typeof aiMessageChunk === 'string') {
              aiMessageContent += aiMessageChunk;
              debouncedSetReceivingMessage(aiMessageContent);  
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

export const getMarkdownContent = async (targetUrl: string): Promise<string[] | null> => {
  const endpoint = "https://asia-northeast2-my-pj-20230703.cloudfunctions.net/get_txt_from_url";
  const params = { url: targetUrl };

  try {
    const response = await fetch(`${endpoint}?url=${encodeURIComponent(params.url)}`);

    if (response.status === 200) {
      const data = await response.json();
      const content: string[] = data['content'];  // 配列として受け取る

      return content;
    } else {
      return null;  // エラーが発生した場合はnullを返す
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const generateConversationTitle = async ({ apiKey, model, messages }: SendToOpenAIProps): Promise<string> => {
  const firstUserMessage = messages.find(m => m.role === 'user');
  const firstAssistantMessage = messages.find(m => m.role === 'assistant');

  const trimmedUserMessage = firstUserMessage ? firstUserMessage.content.substring(0, 100) : '';
  const trimmedAssistantMessage = firstAssistantMessage ? firstAssistantMessage.content.substring(0, 100) : '';

  const newMessages = [
    { role: 'system', content: '会話タイトル生成機として振舞ってください。以下の会話(抜粋)に適用する簡潔かつ適切なタイトルを生成して下さい。【厳守事項】必ず「タイトルのみ」をレスポンスしてください。レスポンスは鍵括弧などでくくらないでください。' },
    { role: 'user', content: trimmedUserMessage },
    { role: 'assistant', content: trimmedAssistantMessage },
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: newMessages,
      stream: false
    })
  });

  const responseData = await response.json();
  if (responseData.choices && responseData.choices[0]?.message?.content) {
    const title = responseData.choices[0].message.content;
    return title;
  } else {
    throw new Error('No content available in the API response');
  }
};