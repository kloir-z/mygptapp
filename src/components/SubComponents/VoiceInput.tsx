//VoiceInput.tsx
import React, { useState, useRef, useEffect } from 'react';
import { StyledButton } from '../../styles/InitialMenu.styles';
import { useDebugInfo } from '../Debugger/DebugContext';
import { useRecording } from 'src/hooks/useSpeechToText';
import { useTextToSpeech } from 'src/hooks/useTextToSpeech';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import { Spinner } from '../Parts/Spinner';
import { Howl } from 'howler';

interface AudioRecorderProps {
  apiKey: string;
  setOcrText: React.Dispatch<React.SetStateAction<string | null>>;
  autoRunOnLoad: boolean;
  setAutoRunOnLoad: React.Dispatch<React.SetStateAction<boolean>>;
  receivingMessage: string;
  gcpApiKey: string;
}

const VoiceInput: React.FC<AudioRecorderProps> = ({ apiKey, setOcrText, autoRunOnLoad, setAutoRunOnLoad, receivingMessage, gcpApiKey }) => {
  const [isTextToSpeechEnabled, setTextToSpeechEnabled] = useState(true);
  const { setDebugInfo } = useDebugInfo();
  const { playSound, recording, toggleRecording, audioUrl, loading } = useRecording(apiKey, setOcrText, setDebugInfo);
  const { textToSpeech, prevReceivingMessageRef } = useTextToSpeech(gcpApiKey);
  const [ttsUrl, setTtsUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false); 
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const soundRef = useRef<Howl | null>(null);


  const handleTextToSpeechChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextToSpeechEnabled(event.target.checked);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoRunOnLoad(event.target.checked);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };


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
      });
    }

    prevReceivingMessageRef.current = receivingMessage;
  }, [receivingMessage]);

  const playTTS = (url: string) => {
    playSound("start_rec");
    const sound = new Howl({
      src: [url],
      format: ['mp3'],
      html5: true,
      volume: isMuted ? 0 : volume,
      onend: () => {
        setIsPlaying(false);
      }
    });
    soundRef.current = sound;
    setIsPlaying(true);
    sound.play();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    if (soundRef.current) {
        soundRef.current.volume(newVolume);
    }
}

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
        <div>
          <StyledButton onClick={() => playTTS(ttsUrl)} disabled={isPlaying}>▶</StyledButton>
          <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} />
          <StyledButton onClick={toggleMute}>
              {isMuted ? "Unmute" : "Mute"}
          </StyledButton>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;