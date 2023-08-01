import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  flex-shrink: 0;
  margin: 5px;
  width: 190px;
  height: 95svh;
  overflow-y: auto;
  outline: none;
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

const iconCss = css`
  opacity: 0;
  transition: opacity 0.1s ease-in-out;
  background-color: #555;
  padding: 3px;

  &:hover {
    opacity: 1;
  }
`;

export const EditIcon = styled.div`
  ${iconCss}
  margin-right: 10px;
`;

export const DeleteIcon = styled.div`
  ${iconCss}
`;

export const ConfirmIcon = styled.div`
  ${iconCss}
  margin-right: 10px;
`;

export const CancelIcon = styled.div`
  ${iconCss}
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
  position: relative;
  overflow: hidden;
  height: 1.2rem;
  flex-grow: 0;
  flex-shrink: 0;
  color: #ebebeb;
  .edit-icon,
  .delete-icon,
  .confirm-icon,
  .cancel-icon {
    opacity: 0;
    transition: opacity 0.1s ease-in-out;
    background-color: #555;
    padding: 3px;
  }

  &:hover .edit-icon,
  &:hover .delete-icon,
  &:hover .confirm-icon,
  &:hover .cancel-icon {
    opacity: 1;
  }
  
  .edit-icon, .confirm-icon {
    margin-right: 10px;
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

export const TitleLeft = styled.div`
  position: absolute;
  left: 10px;
  white-space: nowrap;
  overflow: hidden;
  padding-right: 5px;
`;

export const TitleRight = styled.div`
  position: absolute;
  right: 10px;
`;

