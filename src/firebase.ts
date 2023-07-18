import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

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

export default firebase;
