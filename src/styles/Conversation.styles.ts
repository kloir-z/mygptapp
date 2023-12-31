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
  height: calc(100vh - 81px);
  height: calc(100dvh - 81px);
  overflow-y: scroll;
  overflow-x: hidden;
  /* scroll-behavior: smooth; */
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

export const MessageDiv = styled.div<ToggleProps & { maxHeight?: string, shouldAnimate?: boolean }>`
  background-color: ${props => getColor(props.role)};
  padding: 20px;
  padding-left: 8px;
  margin: 2px;
  text-align: left;
  font-family: MeiryoUI, -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
  font-size: 1rem;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: ${props => 
    (props.role === 'user' || props.role === 'system') && props.collapsed !== undefined
      ? (props.collapsed ? '150px' : props.maxHeight)
      : props.maxHeight
  };
  overflow: hidden;
  transition: ${props => props.shouldAnimate ? 'max-height 0.5s ease-in-out' : 'none'};
`;

export const ToggleCollapseButtonBottom= styled.button<ToggleProps>`
  margin: 0px 2px;
  position: absolute;
  bottom: -1px;
  z-index: 1100;
  height: ${props => props.collapsed ? '120px' : '40px'};
  width: calc(100% - 26px);
  cursor: pointer;
  background: transparent;
  color: #ebebeb;
  border: none;
  font-size: ${props => props.collapsed ? '1rem' : '0.7rem'};
  padding: ${props => props.collapsed ? '10px' : '2px'};
  font-weight: ${props => props.collapsed ? 'bold' : ''};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  @media (hover: hover) and (pointer: fine) {
  &:hover {
    color: #ffffff92;
  }}
`;

export const ToggleCollapseBarBottom= styled.div<ToggleProps>`
  margin: 0px 2px;
  position: absolute;
  bottom: -1px;
  z-index: 1000;
  height: ${props => props.collapsed ? '120px' : '40px'};
  width: calc(100% - 26px);
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
  transition: background 0.5s ease-in-out, height 0.5s ease-in-out;
`;

export const ToggleCollapseButton= styled.button`
  margin: 0px;
  position: absolute;
  top: -2px;
  right: 4px;
  z-index: 1100;
  width: 24px;
  height: 24px;
  cursor: pointer;
  background: transparent;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 4px;
  @media (hover: hover) and (pointer: fine) {
  &:hover {
    color: #ffffff92;
  }}
  border: none;
  color: #ebebeb;
`;

export const EditingText = styled.div`
  position: fixed;
  right: 57px;
  top: 36px;
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
  z-index: 3000;
`;

export const IconButton = styled.button`
  font-size: 1rem;
  background-color: #b3b3b3;
  border-radius: 3px;
  padding: 4px;
  margin-left: 30px;
  min-width: 1.2rem;
  border: none;
  display: flex;
  justify-content: center;
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
  &:focus {
    outline: none;
    border: 1px solid #8a94a4;
  }
`;

export const StyledSelect = styled.select`
  margin: 5px;
  font-size: 1rem;
  color: #ffffffe3;
  background-color: #4c586a;
  padding: 5px 8px;
  border-radius: 3px;
  border: none;
  height: 32px;
`;

export const StyledOption = styled.option`
  margin: 5px;
  font-size: 1rem;
`;

export const StyledInput = styled.input`
  font-size: 1rem;
  color: #4c586a;
  background-color: #ebebeb;
  border: solid 1px #ebebeb;
  padding: 5px 4px;
  margin: 0px;
  border-radius: 3px;
  &:focus {
    outline: none;
    border: 1px solid #4c586a;
  }
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

export const WakatiButton = styled.button`
  position: absolute;
  top: 0px;
  right: 40px;
  margin: 0px;
  padding: 2px 8px;
  font-size: 0.65rem;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  color: #ffffffe3;
  opacity: 0.4;
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
