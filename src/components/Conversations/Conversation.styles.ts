import styled from '@emotion/styled';

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

export const Message = styled.pre<{role: string}>`
  background-color: ${props => getColor(props.role)};
  padding: 10px;
  margin: 5px;
  text-align: left;
  font-family: Meiryo;
  font-size: 0.8rem;
  color: #ebebeb;
  white-space: pre-wrap;
`;

export const ConversationContainer = styled.div`
  margin: 5px;
  flex: 1;
`;

export const MessagesContainer = styled.div`
  margin: 5px 0px;
  overflow-y: auto;
  height: calc(100vh - 200px);
`;

export const InputContainer = styled.div`
  /* Styles can be added here */
`;

export const StyledInput = styled.input`
  padding: 2px 6px;
  margin: 5px;
`;

export const StyledSelect = styled.select`
  padding: 2px 6px;
  margin: 5px;
`;

export const StyledOption = styled.option`
  padding: 2px 6px;
  margin: 5px;
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