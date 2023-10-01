import React, { useState, useRef, useEffect } from 'react';
import { StyledButton } from '../../styles/InitialMenu.styles';
import { useDebugInfo } from '../Debugger/DebugContext';
import AudioRecorderPolyfill from 'audio-recorder-polyfill';

interface AudioRecorderProps {
  apiKey: string;
  setOcrText: React.Dispatch<React.SetStateAction<string | null>>;
  setAutoRunOnLoad: React.Dispatch<React.SetStateAction<boolean>>;
  receivingMessage: string;
  gcpApiKey: string;
}

const VoiceInput: React.FC<AudioRecorderProps> = ({ apiKey, setOcrText, setAutoRunOnLoad, receivingMessage, gcpApiKey }) => {
  const [recording, setRecording] = useState(false);
  const hasSpoken = useRef(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalIdRef = useRef<number | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { setDebugInfo } = useDebugInfo();

  const [autoRunOnLoad, setLocalAutoRunOnLoad] = useState(false);
  const [isTextToSpeechEnabled, setTextToSpeechEnabled] = useState(false);

  const handleTextToSpeechChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextToSpeechEnabled(event.target.checked);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setLocalAutoRunOnLoad(checked);
    setAutoRunOnLoad(checked);
  };

  const prevReceivingMessageRef = useRef('');

  useEffect(() => {
    const wasEmpty = prevReceivingMessageRef.current === '';
    const isEmptyNow = receivingMessage === '';

    if (!wasEmpty && isEmptyNow && isTextToSpeechEnabled) {
      // メッセージ受信が終了
      textToSpeech(prevReceivingMessageRef.current);
      console.log(prevReceivingMessageRef.current)
    }

    // 値を更新
    prevReceivingMessageRef.current = receivingMessage;
  }, [receivingMessage]);

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
      console.log(data);  // レスポンスを表示
  
      // 生成された音声を自動再生
      const audio = new Audio("data:audio/mp3;base64," + data.audioContent);
      audio.play();
    } catch (error) {
      console.error("Text-to-Speech Error:", error);
    }
  };

  useEffect(() => {
    // Check if MediaRecorder is available or if it doesn't support audio/wave
    if (!window.MediaRecorder || !MediaRecorder.isTypeSupported('audio/wav')) {
      window.MediaRecorder = AudioRecorderPolyfill;
    }
  }, []);
  
  const toggleRecording = async () => {
    if (recording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
      }
      setRecording(false);
      hasSpoken.current = false;
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = { mimeType: 'audio/wav' };
      const mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: BlobPart[] = [];

      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener('stop', () => {
        if (hasSpoken.current) {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

          const formData = new FormData();
          formData.append('file', audioBlob);
          formData.append('model', 'whisper-1');
          formData.append('language', 'ja');

          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
          setDebugInfo(`${audioBlob.type}`);
      
          fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
            body: formData,
          })
          .then(response => {
            if (!response.ok) {
              return response.json().then(data => {
                throw new Error('API responded with an error');
              });
            }
            return response.json();
          })
          .then(data => {
            setOcrText(data.text);
          })
          .catch(error => {
            console.error('API Error:', error);
          });
          hasSpoken.current = false;
        }
      });

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let belowThresholdTime: number | null = null;

      intervalIdRef.current = window.setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const volume = Math.max(...dataArray);
        setDebugInfo(`${volume}`);

        if (volume >= 180) {
          hasSpoken.current = true;
        }

        if (hasSpoken.current && volume < 120) {
          if (belowThresholdTime === null) {
            belowThresholdTime = Date.now();
          } else if (Date.now() - belowThresholdTime > 800) {
            if (mediaRecorderRef.current) {
              mediaRecorderRef.current.stop();
            }
            if (intervalIdRef.current !== null) {
              clearInterval(intervalIdRef.current);
            }
            setRecording(false);
          }
        } else {
          belowThresholdTime = null;
        }
      }, 10);

      mediaRecorder.start();
      setRecording(true);
    }
  };

  return (
    <div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={autoRunOnLoad}
            onChange={handleCheckboxChange}
          />
          Auto Run On Load
        </label>
        <br></br>
        <label>
          <input
            type="checkbox"
            checked={isTextToSpeechEnabled}
            onChange={handleTextToSpeechChange}
          />
          Text To Speech
        </label>
      </div>
      <StyledButton onClick={toggleRecording}>
        {recording ? 'Stop' : 'Start'}
      </StyledButton>
      {audioUrl && <audio controls src={audioUrl}>Your browser does not support the audio element.</audio>}
    </div>
  );
};

export default VoiceInput;