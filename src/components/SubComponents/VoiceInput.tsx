//VoiceInput.tsx
import React, { useState, useRef, useEffect } from 'react';
import { StyledButton } from '../../styles/InitialMenu.styles';
import { useDebugInfo } from '../Debugger/DebugContext';
import { useRecording } from 'src/hooks/useSpeechToText';
import { useTextToSpeech } from 'src/hooks/useTextToSpeech';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import { HiSpeakerWave } from "react-icons/hi2";
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
  const [isTextToSpeechEnabled, setTextToSpeechEnabled] = useState(false);
  const { setDebugInfo } = useDebugInfo();
  const { recording, toggleRecording, audioUrl, loading } = useRecording(apiKey, setOcrText, setDebugInfo);
  const { textToSpeech, prevReceivingMessageRef } = useTextToSpeech(gcpApiKey);
  const [audioTTSUrl, setAudioTTSUrl] = useState<string | null>(null);


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
      textToSpeech(prevReceivingMessageRef.current).then(url => {
        setAudioTTSUrl(url);
        playTTS(url);  // ここで再生を試みる
      });
      console.log(prevReceivingMessageRef.current)
    }

    // 値を更新
    prevReceivingMessageRef.current = receivingMessage;
  }, [receivingMessage]);

  const playTTS = (url: string) => {
    // AudioContextの状態をチェック
    if (audioContextRef.current.state === "suspended") {
      alert("音声の再生を開始するには、一度画面をクリックしてください。");
      document.addEventListener("click", resumeAudioContextAndPlay);
      return;  // ここで関数の実行を中断
    }
  
    // AudioContextの状態がrunningの場合、直接再生
    const sound = new Howl({
      src: [url],
      format: ['mp3'],
      html5: true
    });
    sound.play();
  };
  
  const resumeAudioContextAndPlay = () => {
    audioContextRef.current.resume().then(() => {
      document.removeEventListener("click", resumeAudioContextAndPlay);
      // AudioContextが再開された後で再生を再試行
      if (audioTTSUrl) {
        playTTS(audioTTSUrl);
      }
    });
  };

  const audioContextRef = useRef(new AudioContext());

  useEffect(() => {
    // AudioContextの状態がsuspendedなら、ユーザーのインタラクションを促す
    if (audioContextRef.current.state === "suspended") {
      alert("音声の再生を開始するには、一度画面をクリックしてください。");
      document.addEventListener("click", resumeAudioContext);
    }
    return () => {
      document.removeEventListener("click", resumeAudioContext);
    };
  }, []);

  const resumeAudioContext = () => {
    audioContextRef.current.resume().then(() => {
      document.removeEventListener("click", resumeAudioContext);
    });
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
    </div>
  );
};

export default VoiceInput;