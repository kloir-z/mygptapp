//useScroll.ts
import { useState, useEffect, useRef } from 'react';
import { ConversationData } from 'src/types/Conversations.types';

const useScroll = (displayMessages?: ConversationData[], receivingMessage?: string, editingMessageIndex?: number | null) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const scrollToBottom = () => {
    setTimeout(() => {
      interface CustomWindow extends Window { MSStream?: any}
      const customWindow = window as CustomWindow;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !customWindow.MSStream;
      if (isIOS) {
        messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: 'auto' });
        window.scrollTo(0, document.body.scrollHeight);
      }
      else {
        messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: 'auto' });
      }
    }, 0);
  };

  const scrollToTop = () => {
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
        window.scrollTo(0, 0);
      }
    }, 0);
  };
  
  useEffect(() => {
    setTimeout(() => {
      if (scrollContainerRef.current && containerHeight != scrollContainerRef.current.scrollHeight) {
        setContainerHeight(scrollContainerRef.current.scrollHeight);
      }
    }, 0);
  }, [displayMessages, receivingMessage]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = scrollContainerRef.current;
      const isWithinBottom = (scrollHeight - scrollTop - clientHeight) <= 80;
      const hasAssistantMessage = displayMessages?.some(message => message.role === 'assistant');

      if (
        (editingMessageIndex === null && receivingMessage === '' && hasAssistantMessage) || 
        (receivingMessage && isWithinBottom)
      ) {
        scrollToBottom();
      }
    }
  }, [containerHeight]);

  return { messagesEndRef, scrollContainerRef, scrollToTop, scrollToBottom };
};

export default useScroll;