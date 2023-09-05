import styled from '@emotion/styled';

export const InitialMenuContainer = styled.div`
  display: flex;
  width: 100%;
  height: 33px;
  overflow: hidden;
`;

export const StyledSelect = styled.select`
  margin: 3px;
  font-size: 1rem;
  color: #ffffffe3;
  background-color: #4c586a;
  padding: 2px 4px;
  border-radius: 3px;
  border: none;
`;

export const StyledOption = styled.option`
  margin: 5px;
  font-size: 1rem;
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
export const StyledInput = styled.input`
  margin: 3px;  
  font-size: 1rem;
  color: #4c586a;
  background-color: #ebebeb;
  border: none;
  padding: 5px 4px;
  border-radius: 3px;
`;