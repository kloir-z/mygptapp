//UserMenu.tsx
import React, { useRef, useEffect } from "react";
import { AuthContext } from 'src/components/Auth/AuthContext';  
import GoogleButton from "../Parts/GoogleButton";
import { useContext } from 'react';
import { MenuButton } from 'src/styles/UserMenu.styles'

interface UserMenuProps {
  apiKey: string;
  userButtonRef: React.RefObject<HTMLButtonElement>;
  setShowUserMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserMenu: React.FC<UserMenuProps> = ({apiKey, userButtonRef, setShowUserMenu}) => {
  const { user } = useContext(AuthContext);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const { handleLogout } = useContext(AuthContext);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        if (userButtonRef.current && userButtonRef.current.contains(event.target as Node)) {
          return;
        }
        setShowUserMenu(false);
      }
    }
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={userMenuRef} style={{ position: 'absolute', bottom: 'auto', zIndex: '1000'}}>
      <MenuButton isSignedIn={!!user}>Usage Check</MenuButton>
      <GoogleButton isSignedIn={!!user} onClick={handleLogout} />
    </div>
  );
};

export default UserMenu;
