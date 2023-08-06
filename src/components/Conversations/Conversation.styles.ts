import styled from '@emotion/styled';

export const ConversationContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const MessagesContainer = styled.div`
  margin: 0px;
  height: calc(100vh - 112px);
  height: calc(100svh - 112px);
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #282c34;
  }
  ::-webkit-scrollbar-thumb {
    background: #525252a6;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  // Firefox
  scrollbar-width: thin;
  scrollbar-color: #525252 #282c34;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  flex-shrink: 0;
`;

export const Message = styled.div<{role: string}>`
  background-color: ${props => getColor(props.role)};
  padding: 10px;
  margin: 2px;
  text-align: left;
  font-family: MeiryoUI, -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
  font-size: 0.8rem;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const EditingText = styled.div`
  position: fixed;
  right: 4px;
  top: 35px;
  margin: 0px;
  font-size: 0.8rem;
  color: rgb(12 12 12);
  background-color: white;
  opacity: 0.5;
  padding: 4px;
  padding-right: 112px;
  border-radius: 3px; 
`;

type OkCancelButtonProps = {
  right?: string;
};

export const OkCancelButton = styled.button<OkCancelButtonProps>`
  margin: 4px;
  margin-top: 0px;
  padding: 5px 10px;
  font-size: 0.8rem;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.75); 
  background: rgba(51, 99, 150, 0.75);
  &:hover {
    background: rgba(65, 125, 189, 0.75);
  }
  position: fixed;
  top: 37px;
  right: ${props => props.right || '0px'};
`;

const getColor = (role: string) => {
  switch (role) {
    case 'system':
      return 'lightgray';
    case 'user':
      return '#4c586a';
    case 'assistant':
      return '#393e52';
    default:
      return 'white';
  }
};
