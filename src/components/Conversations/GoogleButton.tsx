import React from 'react';
import styled from '@emotion/styled';
import googleIcon from 'src/icons/Google_G_Logo.svg';

const Button = styled.button`
  background-color: #393e52;
  color: white;
  width: 180px;
  height: 50px;
  border-radius: 2px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 3px 4px 0 rgba(0,0,0,.25);
  direction: ltr;
  
  &:hover {
    background-color: #42475c;
  }
`;

const Icon = styled.img`
  margin-right: 15px;
`;

interface GoogleButtonProps {
  onClick: () => void;
  isSignedIn: boolean;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ onClick, isSignedIn }) => {
  return (
    <Button onClick={onClick}>
      <Icon src={googleIcon} alt="Google Logo" />
      {isSignedIn ? 'Sign out' : 'Sign in with Google'} 
    </Button>
  );
};

export default GoogleButton;