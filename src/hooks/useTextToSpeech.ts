import { useRef } from 'react';
import { audioContext } from 'src/hooks/useSpeechToText';

export const useTextToSpeech = (gcpApiKey: string) => {
  const prevReceivingMessageRef = useRef('');

  const textToSpeech = async (text: string) => {
    const endpoint = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${gcpApiKey}`;
  
    const payload = {
      input: {
        text: text
      },
      voice: {
        languageCode: 'ja-JP',
        name: 'ja-JP-Neural2-C'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        pitch: '-3.2',
        speakingRate: '1.19'
      }
    };
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) {
        throw new Error('API responded with an error');
      }
  
      const data = await response.json();
      const audioData = await fetch("data:audio/mp3;base64," + data.audioContent).then(response => response.arrayBuffer());

      // AudioContextでの再生
      const bufferSource = audioContext.createBufferSource();
      audioContext.decodeAudioData(audioData, (buffer) => {
        bufferSource.buffer = buffer;
        bufferSource.connect(audioContext.destination);
        bufferSource.start(0);
      });
    } catch (error) {
      console.error("Text-to-Speech Error:", error);
    }
  };

  return { textToSpeech, prevReceivingMessageRef };
};