// AuthProvider.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
