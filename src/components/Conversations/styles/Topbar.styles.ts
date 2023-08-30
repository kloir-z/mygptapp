import styled from '@emotion/styled';

export const TopbarContainer = styled.div`
  display: flex;
  width: 100%;
  height: 33px;
  background-color: #ffffff0a;
  overflow: hidden;
`;

export const StyledSelect = styled.select`
  margin: 3px;
  font-size: 0.8rem;
  color: #ffffffe3;
  background-color: #4c586a;
  padding: 2px 4px;
  border-radius: 3px;
  border: none;
  &:hover {
    background: #6a798e;
  }
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
  color: #ffffffe3; 
  background-color: #4c586a;
  position: relative;
  display: flex;
  align-items: center;
  @media (hover: hover) and (pointer: fine) {
  &:hover {
    background: #6a798e;
  }}
`;

export const NotificationDot = styled.label`
  color: #ff0000c6; 
  position: absolute;
  top: -1px;
  right: 4px;
`;