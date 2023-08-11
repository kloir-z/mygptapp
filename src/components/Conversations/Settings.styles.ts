import styled from '@emotion/styled';

export const SystemPromptSettingsContainer = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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

export const StyledInput = styled.input`
  padding: 2px 6px;
  margin: 5px;
  font-size: 0.8rem;
  width: 100px;
`;

export const SystemPromptTextarea = styled.textarea`
  position: relative;
  width: 70vw;
  width: 70svw;
  max-width: 600px;
  height: auto;
  max-height: 40vh;
  max-height: 40svh;
  margin: 4px;
  margin-bottom: 0px;
  padding: 10px 15px;
  resize: none;
  overflow-y: auto;
  border-radius: 3px;
  border: 1px solid #576374;
  box-sizing: border-box;
  font-family: MeiryoUI, -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
  font-size: 0.8rem;
  color: #ebebeb;
  background-color: #4c586a;
;
`;
