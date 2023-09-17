//UserMenu.styles.ts
import styled from '@emotion/styled';

export const MenuButton = styled.button`
  background-color: #4c586a;
  color: white;
  width: 100%;
  height: auto;
  padding: 8px 16px;
  border-radius: 2px;
  border: none;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 3px 4px 0 rgba(0,0,0,.25);
  direction: ltr;
  white-space: nowrap;
  &:hover {
    background-color: #6a798e;
  }
`;

export const Icon18px = styled.img`
  margin-right: 10px;
  width:18px;
  height: 18px;
`;
