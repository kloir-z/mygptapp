import styled from '@emotion/styled';

export const ConversationContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 0px;
  position: relative;
`;

export const MessagesContainer = styled.div`
  margin: 0px;
  height: calc(100vh - 112px);
  height: calc(100svh - 112px);
  overflow-y: scroll;
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
  position: absolute;
  right: 10px;
  top: 2px;
  margin: 0px;
  font-size: 0.8rem;
  color: rgb(12 12 12);
  background-color: white;
  opacity: 0.7;
  padding: 4px;
  border-radius: 3px; 
  display: flex;
  align-items: center;
`;

export const OkCancelButton = styled.button`
  margin: 2px;
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
`;

export const EditTextarea = styled.textarea`
  position: relative;
  width: calc(100% - 8px);
  margin: 4px;
  margin-bottom: 0px;
  padding: 25px 10px;
  height: auto;
  resize: none;
  overflow: hidden;
  border-radius: 3px;
  border: 1px solid #576374;
  box-sizing: border-box;
  font-family: MeiryoUI, -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
  font-size: 0.8rem;
  color: #ebebeb;
  background-color: #4c586a;
;
`;

export const StyledSelect = styled.select`
  margin: 5px;
  font-size: 0.8rem;
`;

export const StyledOption = styled.option`
  margin: 5px;
  font-size: 0.8rem;
`;

export const StyledInput = styled.input`
  padding: 2px 6px;
  margin: 5px;
  font-size: 0.8rem;
  width: 100px;
`;
export const StyledButton = styled.button`
  margin: 3px;
  padding: 5px 10px;
  font-size: 0.8rem;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.85); 
  background: rgba(51, 99, 150, 0.85);
  &:hover {
    background: rgba(65, 125, 189, 0.85);
  }
`;

const getColor = (role: string) => {
  switch (role) {
    case 'system':
      return '#1a222c';
    case 'user':
      return '#4c586a';
    case 'assistant':
      return '#393e52';
    default:
      return 'white';
  }
};
