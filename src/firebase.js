import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAnGJMmjjHacIDcOBTj5h1dAXRUqQatJNE",
  authDomain: "prisma-figures.firebaseapp.com",
  projectId: "prisma-figures",
  messagingSenderId: "927065030122",
  appId: "1:927065030122:web:44e1f8127ec6c20fee0693"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
