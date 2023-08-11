import styled from '@emotion/styled';

export const TopbarContainer = styled.div`
  display: flex;
  width: 100%;
  height: 33px;
  background-color: #6c727e;
  overflow: hidden;
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
  color: rgba(255, 255, 255, 0.85); 
  background: rgba(51, 99, 150, 0.85);
  &:hover {
    background: rgba(65, 125, 189, 0.85);
  }
`;