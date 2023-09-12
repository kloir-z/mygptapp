//MessageItem.tsx
import { useState, useRef, useEffect } from 'react';
import { ConversationData } from '../types/Conversations.types';
import { SyntaxHighlight } from './SyntaxHighlight';
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { MessageDiv, EditTextarea, EditingText, ToggleCollapseBarBottom, ToggleCollapseButton, WakatiButton } from '../styles/Conversation.styles';
import React, { useMemo } from 'react';
import { WakachiModal } from './WakachiModal';

const MessageItem: React.FC<{
  ConversationData: ConversationData;
  editing: boolean;
  index: number;
  onDoubleClick: () => void;
  handleConfirmEditing: (index: number) => void;
  handleCancelEditing: () => void;
  deleteMessage: (index: number) => void;
  tempMessageContent: string | null;
  handleContentChange: (value: string) => void;
  editTextAreaRef: React.RefObject<HTMLTextAreaElement>;
}> = ({
  ConversationData,
  editing,
  index,
  onDoubleClick,
  handleConfirmEditing,
  handleCancelEditing,
  deleteMessage,
  tempMessageContent,
  handleContentChange,
  editTextAreaRef
}) => {

  const newLineCount = (ConversationData.content.match(/\n/g) || []).length;

  const shouldDisplayToggle = (ConversationData.role === 'user' || ConversationData.role === 'system') && (ConversationData.content.length >= 600 || newLineCount >= 10);
  const [collapsed, setCollapsed] = useState(false);

  const messageDivRef = useRef<HTMLDivElement>(null); 
  const [maxHeight, setMaxHeight] = useState('10000px');
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isWakachiModalOpen, setIsWakachiModalOpen] = useState(false);
  
  const toggleCollapse = () => {
    if (collapsed) {
      setMaxHeight('1500px');
    } else {
      if (messageDivRef.current) {
        const height = messageDivRef.current.offsetHeight;
        setMaxHeight(`${height}px`);
      }
      setTimeout(() => {
        setMaxHeight('');
      }, 700);
    }
  
    if (messageDivRef.current) {
      messageDivRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (maxHeight === '150px') {
      setCollapsed(true);
    } else if (maxHeight === '1500px') {
      setCollapsed(false);
      timer = setTimeout(() => {
        setMaxHeight('');
      }, 510);
    } else if (maxHeight !== '') {
      setMaxHeight('150px');
    }
    
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [maxHeight]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (messageDivRef.current && shouldDisplayToggle) {
      setMaxHeight(`150px`);
      timer = setTimeout(() => {
        setShouldAnimate(true);
      }, 10);
    } else {
      setMaxHeight('')
    }
    
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  const highlightedContent = useMemo(() => SyntaxHighlight(ConversationData.content), [ConversationData.content]);

  return (
    <div style={{position: 'relative'}}>
      <MessageDiv
        ref={messageDivRef}
        role={ConversationData.role}
        collapsed={collapsed}
        onDoubleClick={onDoubleClick}
        maxHeight={maxHeight}
        shouldAnimate={shouldAnimate}
      >
      <WakatiButton onClick={() => setIsWakachiModalOpen(true)}>Use Fast Reading</WakatiButton>
      <WakachiModal 
        text={ConversationData.content} 
        show={isWakachiModalOpen} 
        onClose={() => setIsWakachiModalOpen(false)}
      />
        {editing ? (
          <>
            <EditTextarea
              value={tempMessageContent || ''}
              onChange={e => handleContentChange(e.target.value)}
              rows={tempMessageContent?.split('\n').length || 1}
              ref={editTextAreaRef}
            />
            <EditingText>
              Editing...
              <FaCheck className="Icon" style={{ color: 'rgb(41, 175, 0)' }} onClick={() => handleConfirmEditing(index)} />
              <FaTimes className="Icon" style={{ color: 'red' }} onClick={handleCancelEditing} />
              <FaTrash className="Icon" style={{ color: '#404040' }} onClick={() => deleteMessage(index)} />
            </EditingText>
          </>
        ) : (
          highlightedContent
        )}
      </MessageDiv>
      {shouldDisplayToggle && (
        <>
        {!collapsed && 
          <ToggleCollapseButton 
            role={ConversationData.role}
            onClick={toggleCollapse}
          >
            ▲
          </ToggleCollapseButton>
        }
        <ToggleCollapseBarBottom 
          role={ConversationData.role}
          collapsed={collapsed} 
          onClick={toggleCollapse}
        >
          {collapsed && '▼' || '▲'}
        </ToggleCollapseBarBottom>
        <div style={{position: 'absolute', bottom: '-1px', zIndex: '1000', width: '100%', backgroundColor: '#282c34', height: '2px'}}></div>
        </>
      )}
    </div>
  );
};

export default MessageItem;