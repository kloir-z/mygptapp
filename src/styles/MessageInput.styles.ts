import styled from '@emotion/styled';

export const MessageInputContainer = styled.div`
  position: relative;
`;

export const MessageInputBottomContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

export const StyledTextarea = styled.textarea`
  position: relative;
  width: calc(100% - 8px);
  height: auto;
  margin: 4px;
  margin-bottom: 0px;
  padding: 10px 15px;
  resize: none;
  overflow: hidden;
  border-radius: 3px;
  border: 1px solid #576374;
  box-sizing: border-box;
  font-family: MeiryoUI, -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
  font-size: 1rem;
  line-height: 1.2rem;
  color: #ebebeb;
  background-color: #4c586a;
;
`;

export const CalcTokenButton = styled.button`
  margin: 4px;
  margin-top: 0px;
  padding: 5px 10px;
  font-size: 1rem;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.75); 
  background: rgba(51, 99, 150, 0.75);
  &:hover {
    background: rgba(65, 125, 189, 0.75);
  }
`;

export const SendButton = styled.button`
  position: absolute;
  right: 8px;
  bottom: 8px;
  margin: 0px;
  padding: 5px 10px;
  font-size: 1rem;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.5); 
  background: rgba(51, 99, 150, 0.5);
  @media (hover: hover) and (pointer: fine) {
  &:hover {
    background: rgba(65, 125, 189, 0.5);
  }}
  &:disabled {
    color: rgba(255, 255, 255, 0.137);
    background: rgba(70, 82, 92, 0.5);
    cursor: not-allowed;
  }
  z-index: 1100;
`;
