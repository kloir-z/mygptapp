import { useRef, useState } from 'react';
import AudioRecorderPolyfill from 'audio-recorder-polyfill';
import { useDebugInfo } from 'src/components/Debugger/DebugContext';
import { Howl } from 'howler';

export const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

export const playSound = (filename: string): Promise<void> => {
  return new Promise((resolve) => {
    const sound = new Howl({
      src: [`${process.env.PUBLIC_URL}/sounds/${filename}.mp3`],
      format: ['mp3'],
      html5: true,
      autoplay: true
    });

    sound.once('end', () => {
      resolve();
    });

    sound.play();
  });
};

export const useRecording = (apiKey: string, setOcrText: React.Dispatch<React.SetStateAction<string | null>>, setDebugInfo: any) => {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false); 
  const hasSpoken = useRef(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalIdRef = useRef<number | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
    
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
        playSound("test1");
        setLoading(true);
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
            // setDebugInfo(`${audioBlob.type}`);
        
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
          stream.getTracks().forEach(track => track.stop());
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
  
          if (volume >= 170) {
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
        playSound("start_rec");
        mediaRecorder.start();
        setRecording(true);
        setLoading(false);
      }
    };
  
    return { playSound, recording, toggleRecording, audioUrl, loading };
  };
  
  // Check if MediaRecorder is available or if it doesn't support audio/wave
  if (!window.MediaRecorder || !MediaRecorder.isTypeSupported('audio/wav')) {
    window.MediaRecorder = AudioRecorderPolyfill;
  }