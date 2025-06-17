import { initializeApp } from "firebase/app";

// @ts-ignore
// This is a workaround for the issue with Firebase and React Native Async Storage
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey:            process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain:        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId:         process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket:     process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId:             process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const auth = getAuth(app);
export const db = getFirestore(app);
