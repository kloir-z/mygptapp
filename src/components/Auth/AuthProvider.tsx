import React, { useState, useEffect, createContext, ReactNode } from "react";
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
    const provider = new firebase.auth.GoogleAuthProvider();

    auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        auth.signInWithRedirect(provider);
      }
    });

    auth.getRedirectResult().then((result) => {
      if (result.user) {
        setUser(result.user);
      }
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
