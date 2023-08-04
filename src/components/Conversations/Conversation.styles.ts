import styled from '@emotion/styled';

export const ConversationContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

export const MessagesContainer = styled.div`
  margin: 0px;
  height: calc(100vh - 104px);
  height: calc(100svh - 104px);
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
  color: #ebebeb;
  white-space: pre-wrap;
  word-break: break-word;
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
