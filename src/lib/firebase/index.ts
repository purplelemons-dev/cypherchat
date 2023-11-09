
import { initializeApp, getApps, getApp, deleteApp, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Initialize Firebase
const options = {
  apiKey: "AIzaSyC9-P7RB6lzNabhXfbDnHthMCk3DKqC5JM",
  authDomain: "cypherchat-404502.firebaseapp.com",
  projectId: "cypherchat-404502",
  storageBucket: "cypherchat-404502.appspot.com",
  messagingSenderId: "649846122994",
  appId: "1:649846122994:web:45e256b968cd380198e36b",
  measurementId: "G-3R5MGBX68B"
};

let firebaseApp: FirebaseApp;
// force clean init because it can get weird sometimes
if (!getApps().length) {
  firebaseApp = initializeApp(options);
} else {
  firebaseApp = getApp();
  deleteApp(firebaseApp);
  firebaseApp = initializeApp(options);
}

export const { firestore, auth, storage, app } = {
  firestore: getFirestore(firebaseApp),
  auth: getAuth(firebaseApp),
  storage: getStorage(firebaseApp),
  app: firebaseApp
}
