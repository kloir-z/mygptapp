// AuthContext.tsx
import React from 'react';
import { User } from 'firebase/auth';

export interface AuthContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = React.createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
});
