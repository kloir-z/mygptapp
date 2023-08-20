import { ConversationData } from './types/Conversations.types';
import { SyntaxHighlight } from './SyntaxHighlight';
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { MessageDiv, EditTextarea, EditingText } from './styles/Conversation.styles';
import React, { useMemo } from 'react';

type MessageListProps = {
  messages: ConversationData[];
  editingMessageIndex: number | null;
  tempMessageContent: string | null;
  onDoubleClickMessage: (messages: ConversationData[], index: number) => void;
  handleContentChange: (value: string) => void;
  handleConfirmEditing: (index: number) => void;
  handleCancelEditing: () => void;
  deleteMessage: (index: number) => void;
  editTextAreaRef: React.RefObject<HTMLTextAreaElement>;
};

const MessageList: React.FC<MessageListProps> = ({
  messages,
  editingMessageIndex,
  tempMessageContent,
  onDoubleClickMessage,
  handleContentChange,
  handleConfirmEditing,
  handleCancelEditing,
  deleteMessage,
  editTextAreaRef
}) => {
  const renderedMessages = useMemo(() => {
    return messages.map((message: ConversationData, index: number) => (
      <MessageDiv
        key={index}
        role={message.role}
        onDoubleClick={() => onDoubleClickMessage(messages, index)}
      >
        {editingMessageIndex === index ? (
              <>
              <EditTextarea
                value={tempMessageContent || ''}
                onChange={e => handleContentChange(e.target.value)}
                rows={tempMessageContent?.split('\n').length || 1}
                ref={editTextAreaRef} 
              />
              <>
                <EditingText>Editing...
                  <FaCheck className="Icon" style={{color:'green'}} onClick={() => handleConfirmEditing(index)}/>
                  <FaTimes className="Icon" style={{color:'red'}} onClick={handleCancelEditing}/>
                  <FaTrash className="Icon" style={{color:'#404040'}} onClick={() => deleteMessage(index)}/>
                </EditingText>
              </>
            </>
          ) : (
        SyntaxHighlight(message.content)
        )}
      </MessageDiv>
    ));
  }, [messages, editingMessageIndex, tempMessageContent]);

  return <>{renderedMessages}</>;
};

export default MessageList;