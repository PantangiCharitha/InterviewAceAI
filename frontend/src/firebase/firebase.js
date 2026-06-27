import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDaEt40kL_G1ylp0Jz78nfIZFdZ6KXLQ40",
  authDomain: "interviewaceai-d60cd.firebaseapp.com",
  projectId: "interviewaceai-d60cd",
  storageBucket: "interviewaceai-d60cd.firebasestorage.app",
  messagingSenderId: "368527587597",
  appId: "1:368527587597:web:24c7e7de78181560565844",
  measurementId: "G-LSVJ4387TF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider =
  new GoogleAuthProvider();

export default app;