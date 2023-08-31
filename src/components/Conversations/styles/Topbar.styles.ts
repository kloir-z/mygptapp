import styled from '@emotion/styled';

export const TopbarContainer = styled.div`
  display: flex;
  width: 100%;
  height: 2.25rem;
  background-color: #ffffff0a;
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
  @media (hover: hover) and (pointer: fine) {
  &:hover {
    background: #6a798e;
  }}
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

export const TokenText = styled.div`
  margin: 3px;
  font-size: 1rem;
  width: 45px;
  padding: 2px;
  color: rgba(255, 255, 255, 0.6); 
  background-color: rgba(255, 255, 255, 0); 
  cursor: pointer;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  @media (hover: hover) and (pointer: fine) {
  &:hover {
    background: #ffffff19;
  }}
`;