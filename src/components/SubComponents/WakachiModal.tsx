// WakachiModal.tsx
import React, { useState, useEffect } from 'react';
import { getWakachi } from 'src/utils/kuromojiUtils';
import { Overlay, ModalContainer } from '../../styles/SettingsModal.styles';
import { Spinner } from '../Parts/Spinner';
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
      getWakachi({ text, maxLength: 3 })
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
    
    const minSpeed = 50; // 最低速度をミリ秒で設定。この値は自由に調整できます。
    
    const calculatePlaybackSpeed = () => {
      const currentText = groupedWakachi[currentIndex];
      const textLength = currentText ? currentText.length : 0;
      // ここで係数をかけています、この例では10を使っていますが、調整可能です。
      const dynamicSpeed = playbackSpeed * textLength / 2;
      
      // 計算された速度とminSpeedを比較し、大きい方を使用します。
      return Math.max(dynamicSpeed, minSpeed);
    };
    
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex + 1 >= groupedWakachi.length) {
            setIsPlaying(false);
            return 0;
          }
          return prevIndex + 1;
        });
      }, calculatePlaybackSpeed());
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
  }, [isPlaying, groupedWakachi, currentIndex, playbackSpeed]);
  
  

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
          height: '200px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {isLoading ? <Spinner /> : (
          <>
            <div className="field">
              <p style={{fontSize: '1.5rem', height: '1.5rem'}}>{groupedWakachi[currentIndex]}</p>
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
            <span>
              {currentIndex}/{groupedWakachi.length - 1}
            </span>
            <br></br>
            </div>
          </>
        )}
      </ModalContainer>
    </Overlay> : null
  );
};