import React from "react";
import firebase from "firebase/compat/app";

type User = firebase.auth.Auth["currentUser"];

export interface AuthContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Set a default value for the context
export const AuthContext = React.createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
});
