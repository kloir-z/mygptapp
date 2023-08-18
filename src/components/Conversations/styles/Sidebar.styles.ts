import styled from '@emotion/styled';

export const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  flex-shrink: 0;
  min-width: 10px;
  height: calc(100vh - 33px);
  height: calc(100svh - 33px);
  overflow-y: auto;
  outline: none;
  overflow-y: scroll;
  position: relative;
  overflow-x: 'hidden'
`;

export const ConversationItem = styled.div<{ active: boolean }>`
  font-family: MeiryoUI, -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
  font-size: 0.8rem;
  background-color: ${props => props.active ? '#70777e' : '#474c57'}; 
  padding: 5px; 
  margin: 0px 0px 2px 0px; 
  cursor: default;
  display: flex; 
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 0;
  flex-shrink: 0;
  color: #ebebeb;
  .Icon {
    font-size: 0.8rem;
    transition: opacity 0.2s ease-in-out;
    background-color: #b3b3b3;
    border-radius: 3px;
    padding: 4px;
    margin-left: 30px;
  }
`;

export const StyledInput = styled.input`
  font-size: 0.8rem;
  color: #4c586a;
  background-color: #ebebeb;
  border: solid 1px #ebebeb;
  padding: 5px 4px;
  margin: 0px;
`;

export const Placeholder = styled.div`
  color: #ebebeb;
  margin: 1rem;
  flex: 1;
`;

export const TitleLeft = styled.div`
  white-space: nowrap;
  overflow-x: auto;
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

