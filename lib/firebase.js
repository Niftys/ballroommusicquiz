import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: "AIzaSyBb_Zkpf3GSu2peVqQ-F2cyRNVHRlJo3C0",
    authDomain: "ballroom-music-quiz.firebaseapp.com",
    projectId: "ballroom-music-quiz",
    storageBucket: "ballroom-music-quiz.firebasestorage.app",
    messagingSenderId: "905880086303",
    appId: "1:905880086303:web:5f7045bc73ef98d6a3b22a",
    measurementId: "G-RBPLM29ET3"
  };  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (only in browser)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
