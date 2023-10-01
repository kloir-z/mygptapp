import { useRef } from 'react';
import { Howl } from 'howler';

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
    
    const audioBlob = new Blob([new Uint8Array(atob(data.audioContent).split("").map(character => character.charCodeAt(0)))], { type: 'audio/mp3' });
    const audioURL = URL.createObjectURL(audioBlob);

    const sound = new Howl({
      src: [audioURL],
      format: ['mp3'],
      html5: true
    });

    sound.play();
  };

  return { textToSpeech, prevReceivingMessageRef };
};