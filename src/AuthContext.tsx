import React from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// 追加: firebase.auth.Auth["currentUser"] の型を User として使用
type User = firebase.auth.Auth["currentUser"];

export type AuthContextProps = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);
