import styled from '@emotion/styled';


export const ConversationItem = styled.div<{ active: boolean }>`
  font-size: 0.8rem;
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
    font-size: 0.8rem;
    transition: opacity 0.2s ease-in-out;
    background-color: #b3b3b3;
    border-radius: 3px;
    padding: 4px;
    margin-left: 30px;
  }
  &:hover {
    background-color: ${props => props.active ? '#80888f' : '#575d68'};
    overflow: visible; // ホバー時にはオーバーフローを許可
    white-space: normal; // 折り返しを許可
  }
`;

export const StyledInput = styled.input`
  font-size: 0.8rem;
  color: #4c586a;
  background-color: #ebebeb;
  border: solid 1px #ebebeb;
  padding: 5px 4px;
  margin: 0px;
  border-radius: 3px;
`;

export const Placeholder = styled.div`
  margin: 1rem;
  flex: 1;
`;

export const TitleLeft = styled.div`
  white-space: nowrap;
  overflow-x: auto;
  display: inline-block;
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

export const TitleRight = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

