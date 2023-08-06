import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  flex-shrink: 0;
  width: 150px;
  height: calc(100vh - 33px);
  height: calc(100svh - 33px);
  overflow-y: auto;
  outline: none;
  overflow-y: scroll;
  direction: rtl;
`;

export const ConversationItem = styled.div<{ active: boolean }>`
  font-family: MeiryoUI, -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
  font-size: 0.8rem;
  background-color: ${props => props.active ? '#70777e' : '#474c57'}; 
  padding: 10px; 
  margin: 0px 0px 2px 0px; 
  cursor: default;
  display: flex; 
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  height: 1rem;
  flex-grow: 0;
  flex-shrink: 0;
  color: #ebebeb;
  .EditIcon {
    font-size: 0.8rem;
    opacity: 0;
    transition: opacity 0.1s ease-in-out;
    background-color: #555;
    padding: 2px;
  }

  &:hover .EditIcon {
    opacity: 1;
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
  direction: ltr;
`;

export const Placeholder = styled.div`
  color: #ebebeb;
  margin: 1rem;
  flex: 1;
`;

export const TitleLeft = styled.div`
  position: absolute;
  left: 10px;
  white-space: nowrap;
  overflow: hidden;
  padding-right: 5px;
  direction: ltr;
  width: calc(100% - 30px);
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
  position: absolute;
  right: 0px;
  top: 0px;
  display: flex;
  flex-direction: column;
  direction: ltr; 
  z-index: 1;
`;

