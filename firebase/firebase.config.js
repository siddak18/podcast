
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getDatabase} from "firebase/database"
import {getStorage} from "firebase/storage"
import {getFirestore} from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyB1_9KvZboD85WxvqvWafVP2eqUq6HKul8",
  authDomain: "speechify-c1a10.firebaseapp.com",
  projectId: "speechify-c1a10",
  storageBucket: "speechify-c1a10.appspot.com",
  messagingSenderId: "656034016504",
  appId: "1:656034016504:web:9b3b10b9d8e273314f5f0d",
  measurementId: "G-68SVXYKH3Q"
};


const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getDatabase(app);
const storage=getStorage(app);
const textdb=getFirestore(app);
export {auth,db,storage,textdb};