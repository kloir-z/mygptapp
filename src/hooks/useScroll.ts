import { useState, useEffect, useRef } from 'react';
import { ConversationData } from 'src/components/Conversations/types/Conversations.types';

const useScroll = (messages?: ConversationData[], content?: string | null) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const scrollToBottom = () => {
    setTimeout(() => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
        window.scrollTo(0, document.body.scrollHeight);
      }
      else {
        messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
      }
    }, 5);
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      setContainerHeight(scrollContainerRef.current.scrollHeight);
    }
  }, [messages, content]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = scrollContainerRef.current;
      const isWithinBottom = (scrollHeight - scrollTop - clientHeight) <= 80;
      if (isWithinBottom) {
        scrollToBottom();
      }
    }
  }, [containerHeight]);

  return { scrollToBottom, messagesEndRef, scrollContainerRef };
};

export default useScroll;