import { useState, useEffect, useRef } from 'react';

const useScroll = (messages?: any[], showMenu?: boolean) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: 'auto' });
    }, 5);
    console.log('scroll to bottom')
    console.log(messagesEndRef)
  };

  useEffect(() => {
    scrollToBottom();
  }, [showMenu]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      setContainerHeight(messagesContainerRef.current.scrollHeight);
    }
    console.log('messages effect')
    console.log(messagesContainerRef)
  }, [messages]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = messagesContainerRef.current;
      const isWithin50pxFromBottom = (scrollHeight - scrollTop - clientHeight) <= 50;
      if (isWithin50pxFromBottom) {
        scrollToBottom();
      }
    }
    console.log('containerHeight effect')
    console.log(messagesContainerRef)
  }, [containerHeight]);

  return { scrollToBottom, messagesEndRef, messagesContainerRef };
};

export default useScroll;