import styled from '@emotion/styled';

export const TopbarContainer = styled.div`
  display: flex;
  width: 100%;
  height: 33px;
  background-color: #6c727e;
  overflow: hidden;
`;

export const StyledInput = styled.input`
  padding: 2px 6px;
  margin: 5px;
  font-size: 0.8rem;
  width: 50px;
`;

export const StyledSelect = styled.select`
  padding: 2px 6px;
  margin: 5px;
  font-size: 0.8rem;
`;

export const StyledOption = styled.option`
  padding: 2px 6px;
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
  color: white;
  background: #336396;
  &:hover {
    background: #244569;
  }
`;