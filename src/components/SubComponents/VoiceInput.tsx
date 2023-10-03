import React, { useState, useRef, useEffect } from 'react';
import { StyledButton } from '../../styles/InitialMenu.styles';
import { useDebugInfo } from '../Debugger/DebugContext';
import { useRecording } from 'src/hooks/useSpeechToText';
import { useTextToSpeech } from 'src/hooks/useTextToSpeech';
import { FaPlay, FaMicrophone, FaStop } from 'react-icons/fa';
import { HiSpeakerWave } from "react-icons/hi2";

interface AudioRecorderProps {
  apiKey: string;
  setOcrText: React.Dispatch<React.SetStateAction<string | null>>;
  autoRunOnLoad: boolean;
  setAutoRunOnLoad: React.Dispatch<React.SetStateAction<boolean>>;
  receivingMessage: string;
  gcpApiKey: string;
}

const VoiceInput: React.FC<AudioRecorderProps> = ({ apiKey, setOcrText, autoRunOnLoad, setAutoRunOnLoad, receivingMessage, gcpApiKey }) => {
  const [isTextToSpeechEnabled, setTextToSpeechEnabled] = useState(false);
  const { setDebugInfo } = useDebugInfo();
  const { recording, toggleRecording, audioUrl } = useRecording(apiKey, setOcrText, setDebugInfo);
  const { textToSpeech, prevReceivingMessageRef } = useTextToSpeech(gcpApiKey);

  const handleTextToSpeechChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextToSpeechEnabled(event.target.checked);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoRunOnLoad(event.target.checked);
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
      // メッセージ受信が終了
      textToSpeech(prevReceivingMessageRef.current);
      console.log(prevReceivingMessageRef.current)
    }

    // 値を更新
    prevReceivingMessageRef.current = receivingMessage;
  }, [receivingMessage]);

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
      {recording ? <FaStop /> : [<FaMicrophone />, ' & ', <HiSpeakerWave />]}
      </StyledButton>
      {audioUrl && <audio controls src={audioUrl}>Your browser does not support the audio element.</audio>}
    </div>
  );
};

export default VoiceInput;