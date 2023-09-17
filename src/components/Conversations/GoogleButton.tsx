//GoogleButton.tsx
import React, { useEffect, useContext } from 'react';
import { MenuButton, Icon18px } from 'src/components/styles/UserMenu.styles'
import googleIcon from 'src/icons/Google_G_Logo.svg';
import { AuthContext } from 'src/components/Auth/AuthContext';

interface GoogleButtonProps {
  onClick: () => void;
  isSignedIn: boolean;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ onClick, isSignedIn }) => {
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const img = new Image();
    img.src = googleIcon;
  }, []);
  
  return (
    <MenuButton onClick={onClick}>
      <Icon18px src={googleIcon} alt="Google Logo" />
      {isSignedIn ? 'Sign out' : 'Sign in with Google'} 
      {user && (
          <> ({user.email || user.displayName || 'Unknown User'})</>
      )}
    </MenuButton>
  );
};

export default GoogleButton;