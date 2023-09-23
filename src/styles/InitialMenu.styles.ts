//InitialMenu.styles.ts
import styled from '@emotion/styled';

export const InitialMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  overflow: hidden;
  padding: 10px;
`;

export const StyledSelect = styled.select`
  margin: 3px;
  font-size: 1rem;
  width: fit-content;
  color: #ffffffe3;
  background-color: #4c586a;
  padding: 6px 4px;
  border-radius: 3px;
  border: none;
  height: 32px;
`;

export const StyledOption = styled.option`
  margin: 5px;
  font-size: 1rem;
`;

export const StyledInput = styled.input`
  margin: 3px;  
  font-size: 1rem;
  width: 90%;
  min-width: 100px;
  max-width: 450px;
  color: #4c586a;
  background-color: #ebebeb;
  border: solid 1px #ebebeb;
  padding: 5px 4px;
  border-radius: 3px;
  &:focus {
    outline: none;
    border: 1px solid #4c586a;
  }
`;

export const StyledButton = styled.button`
  margin: 3px;
  padding: 7px 10px;
  font-size: 1rem;
  width: fit-content;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  color: #ffffffe3; 
  background: rgba(51, 99, 150, 0.85);

  &:disabled {
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.082);
  }

  @media (hover: hover) and (pointer: fine) {
    &:not(:disabled):hover {
      background: rgba(65, 125, 189, 0.85);
    }
  }
`;