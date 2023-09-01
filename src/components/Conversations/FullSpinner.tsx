// FullSpinner.tsx
import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  opacity: 0.7;
  border: 6px solid #f3f3f3;
  border-top: 6px solid #3498db;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  animation: ${spin} 2s linear infinite;
`;

const FullSpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.182);
  z-index: 9999;
`;

const FullSpinner: React.FC = () => {
  return (
    <FullSpinnerContainer>
      <Spinner />
    </FullSpinnerContainer>
  );
};

export default FullSpinner;
