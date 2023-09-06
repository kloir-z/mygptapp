//Conversation.styles.ts
import styled from '@emotion/styled';

export const ConversationContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 0px;
  position: relative;
  .fade-in {
    opacity: 0;
  }
  .fade-in.show {
    opacity: 1;
    transition: opacity 0.2s ease-out;
  }
`;

export const MessagesContainer = styled.div`
  margin: 0px;
  height: calc(100vh - 112px);
  height: calc(100dvh - 112px);
  overflow-y: scroll;
  overflow-x: hidden;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  flex-shrink: 0;
`;

type ToggleProps = { 
  role: string; 
  collapsed?: boolean; 
};

export const MessageDiv = styled.div<ToggleProps>`
  background-color: ${props => getColor(props.role)};
  padding: 10px;
  margin: 2px;
  text-align: left;
  font-family: MeiryoUI, -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
  font-size: 1rem;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: ${props => 
    (props.role === 'user' || props.role === 'system') && props.collapsed !== undefined
      ? (props.collapsed ? '150px' : '4000px')
      : '4000px'
  };
  overflow: hidden;
  transition: max-height 1s ease-out;
`;

export const ToggleCollapseDiv= styled.div<ToggleProps>`
  margin: 0px 2px;
  position: absolute;
  bottom: 0px;
  z-index: 2000;
  width: calc(100% - 14px);
  cursor: pointer;
  background: ${props => {
    if (props.collapsed) {
      if (props.role === 'user') {
        return 'linear-gradient(to bottom, rgb(76 88 106 / 10%), rgb(76 88 106))';
      } else if (props.role === 'system') {
        return 'linear-gradient(to bottom, rgb(26 34 44 / 10%), rgb(26 34 44))';
      }
    }
    return '#00000000';
  }};
  height: ${props => props.collapsed ? '120px' : '15px'};
  font-weight: ${props => props.collapsed ? 'bold' : ''};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  font-size: ${props => props.collapsed ? '1rem' : '0.7rem'};
  padding: ${props => props.collapsed ? '5px' : '1px'};
  @media (hover: hover) and (pointer: fine) {
  &:hover {
    color: #ffffff92;
  }}
`;

export const EditingText = styled.div`
  position: absolute;
  right: 10px;
  top: 2px;
  margin: 0px;
  font-size: 1rem;
  color: rgb(12 12 12);
  background-color: white;
  opacity: 0.7;
  padding: 4px;
  border-radius: 3px; 
  display: flex;
  align-items: center;
  .Icon {
    font-size: 1rem;
    transition: opacity 0.2s ease-in-out;
    background-color: #b3b3b3;
    border-radius: 3px;
    padding: 4px;
    margin-left: 30px;
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
  font-size: 1rem;
  color: #ffffffe3; 
  background-color: #4c586a;
;
`;

export const StyledSelect = styled.select`
  margin: 5px;
  font-size: 1rem;
  color: #ffffffe3;
  background-color: #4c586a;
  padding: 5px 8px;
  border-radius: 3px;
  border: none;
`;

export const StyledOption = styled.option`
  margin: 5px;
  font-size: 1rem;
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

export const StyledButton = styled.button`
  margin: 3px;
  padding: 5px 10px;
  font-size: 1rem;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  color: #ffffffe3;
  background: rgba(51, 99, 150, 0.85);
  @media (hover: hover) and (pointer: fine) {
  &:hover {
    background: rgba(65, 125, 189, 0.85);
  }}
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
