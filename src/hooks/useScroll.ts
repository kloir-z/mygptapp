import { useState, useEffect, useRef } from 'react';

const useScroll = (messages: any[]) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const forwardedRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: 'auto' });
    }, 5);

  };

  useEffect(() => {
    if (forwardedRef.current) {
      setContainerHeight(forwardedRef.current.scrollHeight);
    }
  }, [messages]);

  useEffect(() => {
    if (forwardedRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = forwardedRef.current;
      const isWithin50pxFromBottom = (scrollHeight - scrollTop - clientHeight) <= 50;
      if (isWithin50pxFromBottom) {
        scrollToBottom();
      }
    }
  }, [containerHeight]);

  return { scrollToBottom, messagesEndRef, forwardedRef };
};

export default useScroll;