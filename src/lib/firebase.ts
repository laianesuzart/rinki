import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {
  FB_API_KEY,
  FB_DOMAIN,
  FB_PROJECT,
  FB_BUCKET,
  FB_SENDER_ID,
  FB_APP_ID,
} from "$env/static/private";

const firebaseConfig = {
  apiKey: FB_API_KEY,
  authDomain: FB_DOMAIN,
  projectId: FB_PROJECT,
  storageBucket: FB_BUCKET,
  messagingSenderId: FB_SENDER_ID,
  appId: FB_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
