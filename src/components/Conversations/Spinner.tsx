import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Spinner = styled.div`
  opacity: 0.5;
  border: 2.5px solid #f3f3f3;
  border-top: 2.5px solid #3498db;
  border-radius: 50%;
  width: 0.8em;
  height: 0.8em;
  animation: ${spin} 2s linear infinite;
`;