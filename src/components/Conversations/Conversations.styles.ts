import styled from '@emotion/styled';

export const ConversationWrapper = styled.div`
  display: flex;
`;

export const StyledSidebarDiv = styled.div`
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
  color: #ebebeb;
  .edit-icon {
    opacity: 0;
    transition: opacity 0.1s ease-in-out;
  }
  &:hover .edit-icon {
    opacity: 1;
  }
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

export const StyledInput = styled.input`
  font-family: MairyoUI;
  font-size: 0.8rem;
  background-color: #f7f7f7;
  padding: 0px 5px;
  border: 0px;
  margin: 0px;
  width: 100%;
`;

export const Placeholder = styled.div`
  color: #ebebeb;
  margin: 1rem;
  flex: 1;
`;

