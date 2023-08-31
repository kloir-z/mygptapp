//AuthContext.tsx
import React from "react";
import firebase from "firebase/compat/app";

type User = firebase.auth.Auth["currentUser"];

export interface AuthContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = React.createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
});
