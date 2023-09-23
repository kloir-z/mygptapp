// SpinnerFull.tsx
import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  opacity: 0.6;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  animation: ${spin} 2s linear infinite;
`;

const SpinnerFullContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  height: 100svh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.182);
  z-index: 9999;
`;

const SpinnerFull: React.FC = () => {
  return (
    <SpinnerFullContainer>
      <Spinner />
    </SpinnerFullContainer>
  );
};

export default SpinnerFull;
