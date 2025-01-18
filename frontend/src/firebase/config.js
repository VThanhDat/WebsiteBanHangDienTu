// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCioANs04u8vs8LsT_gLcZ-pzCYm6WrpME",
  authDomain: "e-commerce-dw.firebaseapp.com",
  projectId: "e-commerce-dw",
  storageBucket: "e-commerce-dw.firebasestorage.app",
  messagingSenderId: "757838679853",
  appId: "1:757838679853:web:4e9d8df0adc1d644c0cda4",
  measurementId: "G-WJQQWN3X0R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
