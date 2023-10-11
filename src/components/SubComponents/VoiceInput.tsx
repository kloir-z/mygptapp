//VoiceInput.tsx
import React, { useState, useRef, useEffect } from 'react';
import { StyledInput, StyledButton } from '../../styles/InitialMenu.styles';
import { useDebugInfo } from '../Debugger/DebugContext';
import { useRecording } from 'src/hooks/useSpeechToText';
import { useTextToSpeech } from 'src/hooks/useTextToSpeech';
import { FaMicrophone, FaPlay, FaStop } from 'react-icons/fa';
import { Spinner } from '../Parts/Spinner';
import { Howl } from 'howler';

interface AudioRecorderProps {
  apiKey: string;
  setOcrText: React.Dispatch<React.SetStateAction<string | null>>;
  autoRunOnLoad: boolean;
  setAutoRunOnLoad: React.Dispatch<React.SetStateAction<boolean>>;
  receivingMessage: string;
  gcpApiKey: string;
  setGcpApiKey: React.Dispatch<React.SetStateAction<string>>;
}

const VoiceInput: React.FC<AudioRecorderProps> = ({ apiKey, setOcrText, autoRunOnLoad, setAutoRunOnLoad, receivingMessage, gcpApiKey, setGcpApiKey }) => {
  const [isTextToSpeechEnabled, setTextToSpeechEnabled] = useState(true);
  const { setDebugInfo } = useDebugInfo();
  const { playSound, recording, toggleRecording, audioUrl, loading } = useRecording(apiKey, setOcrText, setDebugInfo);
  const { textToSpeech, prevReceivingMessageRef } = useTextToSpeech(gcpApiKey);
  const [ttsUrl, setTtsUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const soundRef = useRef<Howl | null>(null);
  const ttsButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleTextToSpeechChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextToSpeechEnabled(event.target.checked);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoRunOnLoad(event.target.checked);
  };

  const togglePlayPause = () => {
    if (soundRef.current) {
      if (isPaused) {
        soundRef.current.play();
        setIsPaused(false);
      } else {
        soundRef.current.pause();
        setIsPaused(true);
      }
    }
  };
  
  useEffect(() => {
    if (ttsUrl && ttsButtonRef.current) {
      ttsButtonRef.current.click();
    }
  }, [ttsUrl]);

  useEffect(() => {
    setAutoRunOnLoad(true);
    return () => {
      setAutoRunOnLoad(false)
    }
  }, []);

  useEffect(() => {
    const wasEmpty = prevReceivingMessageRef.current === '';
    const isEmptyNow = receivingMessage === '';

    if (!wasEmpty && isEmptyNow && isTextToSpeechEnabled) {
      textToSpeech(prevReceivingMessageRef.current).then(url => {
        setTtsUrl(url); 
        playSound("start_rec")
      });
    }

    prevReceivingMessageRef.current = receivingMessage;
  }, [receivingMessage]);

  const playTTS = (url: string) => {
    const sound = new Howl({
      src: [url],
      format: ['mp3'],
      html5: true,
      onend: () => {
        setIsPlaying(false);
      }
    });
    soundRef.current = sound;
    setIsPlaying(true);
    sound.play();
  };

  return (
    <div>
      <div>
        <div>
          <label>Set GCP API Key: </label>
          <StyledInput
            type="password"
            placeholder="Enter GCP API Key"
            value={gcpApiKey}
            onChange={(e) => setGcpApiKey(e.target.value)}
          />
        </div>
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
        <StyledButton onClick={toggleRecording} disabled={loading}>
          {
            loading 
            ? <Spinner />
            : recording 
              ? <FaStop /> 
              : [<FaMicrophone />]
          }
        </StyledButton>
      {audioUrl && <audio controls src={audioUrl}>Your browser does not support the audio element.</audio>}
      {ttsUrl && (
          <StyledButton ref={ttsButtonRef} onClick={isPlaying ? togglePlayPause : () => playTTS(ttsUrl)}>
              {isPlaying && isPaused ? <FaPlay />  : isPlaying ? <FaStop />  : <FaPlay /> }
          </StyledButton>
      )}
    </div>
  );
};

export default VoiceInput;