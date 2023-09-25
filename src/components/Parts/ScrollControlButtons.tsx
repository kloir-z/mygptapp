//ScrollControlButtons.tsx
import React, { useState, useEffect, useRef } from 'react';
import { GoMoveToTop, GoMoveToBottom } from "react-icons/go";
import _ from 'lodash';

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
  const [mouseIsMoving, setMouseIsMoving] = useState(false);

  const handleTopMouseOver = () => setTopHovered(true);
  const handleTopMouseOut = () => setTopHovered(false);

  const handleBottomMouseOver = () => setBottomHovered(true);
  const handleBottomMouseOut = () => setBottomHovered(false);

  const handleContainerMouseOver = () => setContainerHovered(true);
  const handleContainerMouseOut = () => setContainerHovered(false);

  interface CustomWindow extends Window { MSStream?: any}
  const customWindow = window as CustomWindow;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !customWindow.MSStream;
  

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
        }, 200); // 200ミリ秒後にスクロールが止まっていれば containerHovered を false に設定
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

  useEffect(() => {
    let mouseMoveTimer: NodeJS.Timeout | null = null;

    const handleMouseMove = () => {
      setMouseIsMoving(true);
      if (mouseMoveTimer) {
        clearTimeout(mouseMoveTimer);
      }
      mouseMoveTimer = setTimeout(() => {
        setMouseIsMoving(false);
      }, 250); // 250ミリ秒後にマウスが動いていなければ mouseIsMoving を false に設定
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (!showButtons) return null;

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: '45svh', 
        right: isIOS ? '4px' : '16px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      onMouseOver={handleContainerMouseOver}
      onMouseOut={handleContainerMouseOut}
    >
      <button 
        title='scrollToTop'
        style={{ 
          cursor: 'pointer', 
          marginBottom: '10px', 
          opacity: topHovered && mouseIsMoving ? 1 : (containerHovered && mouseIsMoving ? 0.4 : 0.1),
          transition: 'opacity 0.3s ease',
          background: 'transparent',
          color: '#ebebeb',
          border: 'none'
        }} 
        onClick={scrollToTop}
        onMouseOver={handleTopMouseOver}
        onMouseOut={handleTopMouseOut}
      >
        <GoMoveToTop size={24} />
      </button>
      <br></br>
      <br></br>
      <button 
        title='scrollToBottom'
        style={{ 
          cursor: 'pointer', 
          opacity: bottomHovered && mouseIsMoving ? 1 : (containerHovered && mouseIsMoving ? 0.4 : 0.1),
          transition: 'opacity 0.3s ease',
          background: 'transparent',
          color: '#ebebeb',
          border: 'none'
        }} 
        onClick={scrollToBottom}
        onMouseOver={handleBottomMouseOver}
        onMouseOut={handleBottomMouseOut}
      >
        <GoMoveToBottom size={24} />
      </button>
    </div>
  );
};

export default ScrollControlButtons;
