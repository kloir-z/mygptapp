import React, { useState, useRef } from 'react';
import { StyledButton } from '../../styles/InitialMenu.styles';
import { useDebugInfo } from '../Debugger/DebugContext';

interface AudioRecorderProps {
  apiKey: string;
  setOcrText: React.Dispatch<React.SetStateAction<string | null>>;
}

const VoiceInput: React.FC<AudioRecorderProps> = ({ apiKey, setOcrText }) => {
  const [recording, setRecording] = useState(false);
  const hasSpoken = useRef(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalIdRef = useRef<number | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { setDebugInfo } = useDebugInfo();

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
      // Start recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });

      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: BlobPart[] = [];

      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.onerror = (event) => {
        const errorEvent = event as any;
        setDebugInfo(`MediaRecorder error: ${errorEvent.error}`);
      };

      mediaRecorder.addEventListener('stop', () => {
        if (hasSpoken.current) {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
          const formData = new FormData();
          formData.append('file', audioBlob);
          formData.append('model', 'whisper-1');
          formData.append('language', 'ja');

          setDebugInfo(`audioBlob.type: ${audioBlob.type}`);
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);  // Blob URLをセット
          const a = document.createElement('a');
          a.href = url;
          a.download = 'test.wav';
          a.click();
      
          fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
            body: formData,
          })
          .then(response => response.json())
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

        if (volume >= 180) {
          hasSpoken.current = true;
        }

        if (hasSpoken.current && volume < 100) {
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
      <StyledButton onClick={toggleRecording}>
        {recording ? 'Stop' : 'Start'}
      </StyledButton>
      {audioUrl && <audio controls src={audioUrl}>Your browser does not support the audio element.</audio>}
    </div>
  );
};

export default VoiceInput;