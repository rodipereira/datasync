
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvLrNeOQYWB3biGyuyLjGY_2ubbjudDvk",
  authDomain: "datasync-ai-62e78.firebaseapp.com",
  projectId: "datasync-ai-62e78",
  storageBucket: "datasync-ai-62e78.firebasestorage.app",
  messagingSenderId: "137314675117",
  appId: "1:137314675117:web:7f95063d3362aa3efe1924",
  measurementId: "G-MZHFM608YE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in browser environment
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, analytics };
