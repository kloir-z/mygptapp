import React from 'react';
import { ConversationData } from './Conversations.types';
import { SyntaxHighlight } from './SyntaxHighlight';
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { Message, EditTextarea, EditingText } from './Conversation.styles';

type MessageListProps = {
  messages: ConversationData[];
  editingMessageIndex: number | null;
  tempMessageContent: string | null;
  onDoubleClickMessage: (messages: ConversationData[], index: number) => void;
  handleContentChange: (value: string) => void;
  handleConfirmEditing: (index: number) => void;
  handleCancelEditing: () => void;
  deleteMessage: (index: number) => void;
};

const MessageList: React.FC<MessageListProps> = ({
  messages,
  editingMessageIndex,
  tempMessageContent,
  onDoubleClickMessage,
  handleContentChange,
  handleConfirmEditing,
  handleCancelEditing,
  deleteMessage
}) => {
  return (
    <>
      {messages.map((message: ConversationData, index: number) => {
        return (
          <Message key={index} role={message.role} onDoubleClick={() => onDoubleClickMessage(messages, index)}>
            {editingMessageIndex === index ? (
              <>
                <EditTextarea
                  value={tempMessageContent || ''}
                  onChange={e => handleContentChange(e.target.value)}
                  rows={tempMessageContent?.split('\n').length || 1}
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
          </Message>
        );
      })}
    </>
  );
};

export default MessageList;
