import { ConversationData } from './types/Conversations.types';
import { SyntaxHighlight } from './SyntaxHighlight';
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { MessageDiv, EditTextarea, EditingText } from './styles/Conversation.styles';
import React, { useMemo } from 'react';

const MessageItem: React.FC<{
  message: ConversationData;
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
  message,
  editing,
  index,
  onDoubleClick,
  handleConfirmEditing,
  handleCancelEditing,
  deleteMessage,
  tempMessageContent,
  handleContentChange,
  editTextAreaRef,
}) => {
  const highlightedContent = useMemo(() => SyntaxHighlight(message.content), [message.content]);

  return (
    <MessageDiv
      role={message.role}
      onDoubleClick={onDoubleClick}
    >
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
            <FaCheck className="Icon" style={{ color: 'green' }} onClick={() => handleConfirmEditing(index)} />
            <FaTimes className="Icon" style={{ color: 'red' }} onClick={handleCancelEditing} />
            <FaTrash className="Icon" style={{ color: '#404040' }} onClick={() => deleteMessage(index)} />
          </EditingText>
        </>
      ) : (
        highlightedContent
      )}
    </MessageDiv>
  );
};

export default MessageItem;