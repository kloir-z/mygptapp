import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Spinner = styled.div`
  opacity: 0.7;
  border: 2.5px solid #f3f3f3;
  border-top: 2.5px solid #3498db;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  animation: ${spin} 2s linear infinite;
`;