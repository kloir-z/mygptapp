import React, { useEffect, useState } from 'react';
import './App.css';
import Conversations from './Conversations';
import { AuthContext } from './AuthContext';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

type User = firebase.auth.Auth["currentUser"];

const firebaseConfig = {
  apiKey: "AIzaSyDDVqsCd0SvanUUc9KiX2_D3oK1yKFkb_c",
  authDomain: "my-pj-20230703.firebaseapp.com",
  projectId: "my-pj-20230703",
  storageBucket: "my-pj-20230703.appspot.com",
  messagingSenderId: "491689842398",
  appId: "1:491689842398:web:12943fb13dce792d4b144f",
  measurementId: "G-M347LMQX1M",
};

firebase.initializeApp(firebaseConfig);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();

    auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        // すでにログイン済みの場合はそのままユーザ情報をセットする
        setUser(currentUser);
        console.log(currentUser);
      } else {
        // 未ログインの場合は認証フローを開始する
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
    <div className="App">
      <AuthContext.Provider value={{ user, setUser }}>
        {user ? <Conversations /> : <div>Loading...</div>}
      </AuthContext.Provider>
    </div>
  );
}

export default App;
