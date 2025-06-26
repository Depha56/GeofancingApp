import { initializeApp } from "firebase/app";

// @ts-ignore
// This is a workaround for the issue with Firebase and React Native Async Storage
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const env = import.meta.env;

const firebaseConfig = {
    apiKey:            env.VITE_FIREBASE_API_KEY,
    authDomain:        env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId:         env.VITE_FIREBASE_PROJECT_ID,
    storageBucket:     env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId:             env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export { messaging, getToken, onMessage };
