//SettingModal.styles.ts
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';

const createFadeAnimation = (fromOpacity: number, toOpacity: number) => keyframes`
  from { opacity: ${fromOpacity}};
  to { opacity: ${toOpacity}};
`;

const fadeAnimation = (fromOpacity: number, toOpacity: number) => css`
  animation: ${createFadeAnimation(fromOpacity, toOpacity)} 0.2s ease-out forwards;
`;

export const Overlay = styled.div<{ fadeStatus: 'in' | 'out' }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: 0;
  ${props => props.fadeStatus === 'out' ? fadeAnimation(1, 0) : fadeAnimation(0, 1)}
`;

export const ModalContainer = styled.div<{ fadeStatus: 'in' | 'out' }>`
  position: relative;
  background: #282c34;
  padding: 20px;
  border: solid 1px rgb(83 87 97);
  border-radius: 5px;
  font-size: 1rem;
  opacity: 0;
  ${props => props.fadeStatus === 'out' ? fadeAnimation(1, 0) : fadeAnimation(0, 1)}
`;

export const SystemPromptSettingsContainer = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const StyledSelect = styled.select`
  margin: 5px;
  font-size: 1rem;
  color: #ebebeb;
  background-color: #4c586a;
  padding: 5px 2px;
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
  &:disabled {
    background: rgba(190, 190, 190, 0.85);
    color: rgba(128, 128, 128, 0.85);
    cursor: not-allowed;
  }
`;

export const SystemPromptTextarea = styled.textarea`
  position: relative;
  width: 70vw;
  width: 70svw;
  max-width: 900px;
  height: auto;
  min-height: 200px;
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
  font-size: 1rem;
  color: #ebebeb;
  background-color: #4c586a;
;
`;

export const CloseButton = styled.div`
  position: absolute;
  top: 0px;
  right: 10px;
  cursor: pointer;
  font-size: 1.7rem;
`;

export const StatusLabel = styled.label`
  color: ${(props: { active: boolean }) => (props.active ? 'green' : 'red')};
`;

export const StyledInput = styled.input`
  margin: 5px;
  font-size: 1rem;
  color: #4c586a;
  background-color: #ebebeb;
  border: none;
  padding: 5px 4px;
  width: 200px;
  border-radius: 3px;
`;