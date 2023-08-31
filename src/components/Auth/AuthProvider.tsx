//AuthProvider.tsx
import React, { useState, useEffect, ReactNode } from "react";
import firebase from './firebase';
import { AuthContext } from './AuthContext';

type User = firebase.auth.Auth["currentUser"];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = firebase.auth();

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
