import React, { useState, useRef } from 'react';

interface AudioRecorderProps {
  apiKey: string;
  setOcrText: React.Dispatch<React.SetStateAction<string | null>>;
}

const VoiceInput: React.FC<AudioRecorderProps> = ({ apiKey, setOcrText }) => {
  const [recording, setRecording] = useState(false);
  const hasSpoken = useRef(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalIdRef = useRef<number | null>(null);

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
      const mediaRecorder = new MediaRecorder(stream);
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
      <button onClick={toggleRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
};

export default VoiceInput;