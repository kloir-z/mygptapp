import React, { useEffect, useContext } from 'react';
import styled from '@emotion/styled';
import googleIcon from 'src/icons/Google_G_Logo.svg';
import { AuthContext } from 'src/components/Auth/AuthContext';  

const Button = styled.button`
  background-color: #393e52;
  color: white;
  width: auto;
  height: auto;
  padding: 8px 16px;
  border-radius: 2px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 3px 4px 0 rgba(0,0,0,.25);
  direction: ltr;
  white-space: nowrap;
  &:hover {
    background-color: #42475c;
  }
`;

const Icon = styled.img`
  margin-right: 10px;
  width:18px;
  height: 18px;
`;

interface GoogleButtonProps {
  onClick: () => void;
  isSignedIn: boolean;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ onClick, isSignedIn }) => {
  const { user, setUser, handleLogout } = useContext(AuthContext);
  useEffect(() => {
    const img = new Image();
    img.src = googleIcon;
  }, []);
  
  return (
    <Button onClick={onClick}>
      <Icon src={googleIcon} alt="Google Logo" />
      {isSignedIn ? 'Sign out' : 'Sign in with Google'} 
      {user && (
          <> ({user.email || user.displayName || 'Unknown User'})</>
      )}
    </Button>
  );
};

export default GoogleButton;