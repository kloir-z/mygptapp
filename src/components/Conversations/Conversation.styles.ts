import styled from '@emotion/styled';

export const ConversationContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

export const MessagesContainer = styled.div`
  margin: 0px;
  height: calc(100svh - 120px);
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
  margin: 5px;
  text-align: left;
  font-family: Mairyo;
  font-size: 0.8rem;
  color: #ebebeb;
  white-space: pre-wrap;
`;

export const StyledButton = styled.button`
  margin: 5px;
  padding: 5px 10px;
  font-size: 0.8rem;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  color: white;
  background: #336396;
  &:hover {
    background: #244569;
  }
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