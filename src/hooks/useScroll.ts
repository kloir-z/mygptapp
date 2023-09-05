//useScroll.ts
import { useState, useEffect, useRef } from 'react';
import { ConversationData } from 'src/components/Conversations/types/Conversations.types';

const useScroll = (displayMessages?: ConversationData[], tempMessageContent?: string | null, receivingMessage?: string) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const scrollToBottom = () => {
    setTimeout(() => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: 'auto' });
        window.scrollTo(0, document.body.scrollHeight);
      }
      else {
        messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: 'auto' });
      }
    }, 5);
  };

  useEffect(() => {
    if (scrollContainerRef.current && containerHeight != scrollContainerRef.current.scrollHeight) {
      setContainerHeight(scrollContainerRef.current.scrollHeight);
    }
  }, [displayMessages, tempMessageContent, receivingMessage]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = scrollContainerRef.current;
      const isWithinBottom = (scrollHeight - scrollTop - clientHeight) <= 80;
      if (receivingMessage === '' || (receivingMessage && isWithinBottom)) {
        scrollToBottom();
      }
    }
  }, [containerHeight]);

  return { scrollToBottom, messagesEndRef, scrollContainerRef };
};

export default useScroll;