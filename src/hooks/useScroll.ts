import { useState, useEffect, useRef } from 'react';
import { ConversationData } from 'src/components/Conversations/types/Conversations.types';

const useScroll = (messages?: ConversationData[], content?: string | null) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: 'auto' });
    }, 0);
    console.log('scrollToBottom')
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      setContainerHeight(scrollContainerRef.current.scrollHeight);
    }
  }, [messages, content]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = scrollContainerRef.current;
      const isWithin50pxFromBottom = (scrollHeight - scrollTop - clientHeight) <= 80;
      if (isWithin50pxFromBottom) {
        scrollToBottom();
      }
    }
    console.log('containerHeight effect')
  }, [containerHeight]);

  return { scrollToBottom, messagesEndRef, scrollContainerRef };
};

export default useScroll;