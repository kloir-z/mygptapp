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
  margin: 0px;
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
  overflow-y: auto;
  height: calc(100vh - 200px);  /* adjust this as per your needs */
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

export const ConversationWrapper = styled.div`
  display: flex;
`;

export const Sidebar = styled.div`
  margin: 5px;
  width: 190px;
  height: 95svh;
  overflow-y: auto;
  outline: none;
`;

export const ConversationItem = styled.div<{ active: boolean }>`
  font-family: MairyoUI;
  font-size: 0.8rem;
  background-color: ${props => props.active ? '#70777e' : '#474c57'}; 
  padding: 10px; 
  margin: 4px; 
  cursor: default;
  display: flex; 
  justify-content: space-between;
  .edit-icon {
    opacity: 0;
    transition: opacity 0.1s ease-in-out;
  }
  &:hover .edit-icon {
    opacity: 1;
  }
`;

export const Placeholder = styled.div`
  margin: 1rem;
  flex: 1;
`;
