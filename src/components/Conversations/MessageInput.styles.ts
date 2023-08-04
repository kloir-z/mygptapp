import styled from '@emotion/styled';

export const MessageInputBottomContainer = styled.div`
  min-height: 35px;
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  flex-direction: row;
  align-items: flex-start;
`;

export const StyledTextarea = styled.textarea`
  width: calc(100% - 4px);
  margin: 4px;
  padding: 10px;
  height: auto;
  resize: none;
  overflow: hidden;
  padding: 10px 15px;
  font-size: 0.8rem;
  border-radius: 3px;
  border: 1px solid #576374;
  box-sizing: border-box;
  color: #ebebeb;
  background-color: #4c586a;
;
`;

export const StyledButton = styled.button`
  margin: 3px 20px 3px 3px;
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

export const InfoText = styled.div`
  margin: 5px;
  font-size: 0.8rem;
  color: #ebebeb;
`;
