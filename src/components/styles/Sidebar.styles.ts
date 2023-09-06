import styled from '@emotion/styled';

export const ConversationItem = styled.div<{ active: boolean }>`
  font-size: 1rem;
  background-color: ${props => props.active ? '#70777e' : 'transparent'}; 
  padding: 5px; 
  cursor: default;
  display: flex; 
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 0;
  flex-shrink: 0;
  border-radius: 4px;
  .Icon {
    font-size: 1rem;
    background-color: #b3b3b3;
    border-radius: 3px;
    padding: 4px;
    margin-right: 30px;
    min-width: 1.2rem;
  }
  @media (hover: hover) {
    &:hover {
      background-color: ${props => props.active ? '#80888f' : '#575d68'};
      overflow: visible;
      white-space: normal;
    }
  }
`;

export const StyledInput = styled.input`
  font-size: 1rem;
  color: #4c586a;
  background-color: #ebebeb;
  border: none;
  padding: 5px 4px;
  margin: 0px;
  border-radius: 3px;
`;

export const Placeholder = styled.div`
  margin: 1rem;
  flex: 1;
`;

export const TitleContainer = styled.div`
  white-space: nowrap;
  overflow-x: auto;
  display: flex;
  align-items: center;
  svg {
    vertical-align: middle;
    width: 20px;
  }
  span {
    vertical-align: middle;
    width: 20px;
  }
  ::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #525252 #282c34;
`;

export const TitleEditIconsContainer = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-left: 20px;
`;

