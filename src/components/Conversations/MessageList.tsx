import { ConversationData } from './types/Conversations.types';
import MessageItem from './MessageItem';

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
  editTextAreaRef,
}) => {
  return (
    <>
      {messages.map((message: ConversationData, index: number) => (
        <MessageItem
          key={index}
          message={message}
          editing={editingMessageIndex === index}
          index={index}
          onDoubleClick={() => onDoubleClickMessage(messages, index)}
          handleConfirmEditing={handleConfirmEditing}
          handleCancelEditing={handleCancelEditing}
          deleteMessage={deleteMessage}
          tempMessageContent={tempMessageContent}
          handleContentChange={handleContentChange}
          editTextAreaRef={editTextAreaRef}
        />
      ))}
    </>
  );
};

export default MessageList;