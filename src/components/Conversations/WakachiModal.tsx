// WakachiModal.tsx
import React, { useState, useEffect } from 'react';
import { getWakachi } from 'src/utils/kuromojiUtils';
import { Overlay, ModalContainer } from '../styles/SettingsModal.styles';
import { Spinner } from './Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faUndo, faBackward  } from '@fortawesome/free-solid-svg-icons';

type WakachiModalProps = {
  text: string;
  show: boolean;
  onClose: () => void;
};

export const WakachiModal: React.FC<WakachiModalProps> = ({ text, show, onClose }) => {
  const [groupedWakachi, setGroupedWakachi] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fadeStatus, setFadeStatus] = useState<'in' | 'out'>('in');
  const [isLoading, setIsLoading] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(200);

  const handleClose = () => {
    setIsPlaying(false);
    setFadeStatus('out');
    setTimeout(() => {
      setFadeStatus('in');
      onClose();
    }, 210);
  };
  
  useEffect(() => {
    if (show) {
      setIsLoading(true);
      setPlaybackSpeed(200);
      getWakachi({ text, maxLength: 5 })
        .then((result) => {
          setGroupedWakachi(result);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    }
  }, [show]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex + 1 >= groupedWakachi.length) {
            setIsPlaying(false);
            return 0;
          }
          return prevIndex + 1;
        });
      }, playbackSpeed);
    } else {
      if (timer) {
        clearInterval(timer);
      }
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isPlaying, groupedWakachi.length, playbackSpeed]);

  const goBackSentence = () => {
    let newIndex = currentIndex - 3;
    if (newIndex < 0) {
      newIndex = groupedWakachi.length - 6;
    }
    while (newIndex > 0) {
      if (groupedWakachi[newIndex].includes('。') || groupedWakachi[newIndex] === ' ') {
        newIndex++;
        break;
      }
      newIndex--;
    }
    setCurrentIndex(newIndex);
  };

  return (
    show ?
    <Overlay fadeStatus={fadeStatus} onMouseDown={handleClose}>
      <ModalContainer
        fadeStatus={fadeStatus}
        onMouseDown={e => e.stopPropagation()}
        onDoubleClick={e => e.stopPropagation()}
        style={{
          width: '80svw',
          maxWidth: '400px',
          height: '160px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {isLoading ? <Spinner /> : (
          <>
            <div className="field">
              <p>{groupedWakachi[currentIndex]}</p>
            </div>
            <div className="field is-grouped">
              <button className="button" onClick={goBackSentence} aria-label="文の先頭に戻る">
                <FontAwesomeIcon icon={faBackward} />
              </button>
              <span>  </span>
              <button className="button" onClick={() => setIsPlaying(!isPlaying)} aria-label={isPlaying ? '一時停止' : '再生'}>
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
              </button>
              <span>  </span>
              <button className="button" onClick={() => setCurrentIndex(0)} aria-label="最初に戻る">
                <FontAwesomeIcon icon={faUndo} />
              </button>
            </div>
            <br></br>
            <span>{playbackSpeed} ms</span>
            <div className="field" style={{width: '95%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <input
              type="range"
              min="50"
              max="700"
              step="10"
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              aria-label="再生速度"
              style={{width: '100%'}}
            />
            <br></br>
            <input
              type="range"
              min="0"
              max={groupedWakachi.length - 1}
              value={currentIndex}
              onChange={(e) => setCurrentIndex(Number(e.target.value))}
              aria-label="進捗シークバー"
              style={{width: '100%'}}
            />
            <br></br>
            </div>
          </>
        )}
      </ModalContainer>
    </Overlay> : null
  );
};