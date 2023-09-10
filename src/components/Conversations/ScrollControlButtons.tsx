//ScrollControlButtons.tsx
import React, { useState, useEffect, useRef } from 'react';
import { GoMoveToTop, GoMoveToBottom } from "react-icons/go";
import _ from 'lodash'; // lodashを使ってthrottleを実装

type ScrollControlButtonsProps = {
  scrollToTop: () => void;
  scrollToBottom: () => void;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
};

const ScrollControlButtons: React.FC<ScrollControlButtonsProps> = ({ scrollToTop, scrollToBottom, scrollContainerRef, messagesEndRef }) => {
  const [topHovered, setTopHovered] = useState(false);
  const [bottomHovered, setBottomHovered] = useState(false);
  const [containerHovered, setContainerHovered] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const handleTopMouseOver = () => setTopHovered(true);
  const handleTopMouseOut = () => setTopHovered(false);

  const handleBottomMouseOver = () => setBottomHovered(true);
  const handleBottomMouseOut = () => setBottomHovered(false);

  const handleContainerMouseOver = () => setContainerHovered(true);
  const handleContainerMouseOut = () => setContainerHovered(false);

  const throttledSetContainerHovered = useRef(
    _.throttle(() => setContainerHovered(true), 50)
  ).current;

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (element) {
      const checkScroll = () => {
        if (element.scrollHeight > element.clientHeight) {
          setShowButtons(true);
        } else {
          setShowButtons(false);
        }
      };

      let scrollTimer: NodeJS.Timeout | null = null;

      const handleScroll = () => {
        throttledSetContainerHovered();
        checkScroll();

        if (scrollTimer) {
          clearTimeout(scrollTimer);
        }

        scrollTimer = setTimeout(() => {
          setContainerHovered(false);
        }, 300); // 300ミリ秒後にスクロールが止まっていれば containerHovered を false に設定
      };
  
      checkScroll();

      element.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', checkScroll);

      return () => {
        element.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [scrollContainerRef, throttledSetContainerHovered, messagesEndRef]);

  if (!showButtons) return null;

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: '33%', 
        right: '16px', 
        zIndex: 1000,
        height: '350px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      onMouseOver={handleContainerMouseOver}
      onMouseOut={handleContainerMouseOut}
    >
      <div 
        style={{ 
          cursor: 'pointer', 
          marginBottom: '10px', 
          opacity: topHovered ? 1 : (containerHovered ? 0.6 : 0.1),
          transition: 'opacity 0.3s ease'
        }} 
        onClick={scrollToTop}
        onMouseOver={handleTopMouseOver}
        onMouseOut={handleTopMouseOut}
      >
        <GoMoveToTop size={24} />
      </div>
      <br></br>
      <br></br>
      <div 
        style={{ 
          cursor: 'pointer', 
          opacity: bottomHovered ? 1 : (containerHovered ? 0.6 : 0.1),
          transition: 'opacity 0.3s ease'
        }} 
        onClick={scrollToBottom}
        onMouseOver={handleBottomMouseOver}
        onMouseOut={handleBottomMouseOut}
      >
        <GoMoveToBottom size={24} />
      </div>
    </div>
  );
};

export default ScrollControlButtons;
