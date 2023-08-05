import styled from '@emotion/styled';

export const TopbarContainer = styled.div`
  display: flex;
  width: 100%;
  height: 33px;
  background-color: #6c727e;
  overflow: hidden;
`;

export const ApiKeyInputPopup = styled.div<{ top?: number; left?: number }>`
  position: absolute;
  padding: 10px 20px;
  top: calc(${props => (props.top ? `${props.top}px` : "0px")} + 2px);
  left: calc(${props => (props.left ? `${props.left}px` : "0px")} - 50px);
  z-index: 1;
  color: #ebebeb;
  font-size: 0.8rem;
  background: #6c727e;
  border: 2px solid #ebebeb;
`;

export const StyledInput = styled.input`
  padding: 2px 6px;
  margin: 5px;
  font-size: 0.8rem;
  width: 100px;
`;

export const StyledSelect = styled.select`
  margin: 5px;
  font-size: 0.8rem;
`;

export const StyledOption = styled.option`
  margin: 5px;
  font-size: 0.8rem;
`;

export const StyledButton = styled.button`
  margin: 3px;
  padding: 5px 10px;
  font-size: 0.8rem;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  color: #ebebeb;
  background: #336396;
  &:hover {
    background: #244569;
  }
`;

export const ApiKeyButton = styled.button`
  margin: 3px;
  padding: 5px 10px;
  font-size: 0.8rem;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  color: #ebebeb;
  background: #336396;
  &:hover {
    background: #244569;
  }
`;