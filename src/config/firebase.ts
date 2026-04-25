import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// `getReactNativePersistence` is exported from `firebase/auth` in some SDK
// versions and from `firebase/auth/react-native` in others. Resolve at
// runtime so we work on Firebase v10 and v11+ without a hard import error.
let getReactNativePersistence: ((s: any) => any) | undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fbAuth: any = require('firebase/auth');
  getReactNativePersistence = fbAuth.getReactNativePersistence;
} catch { /* ignore */ }
if (!getReactNativePersistence) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fbAuthRN: any = require('firebase/auth/react-native');
    getReactNativePersistence = fbAuthRN.getReactNativePersistence;
  } catch { /* ignore */ }
}

// Firebase configuration
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || process.env.FIREBASE_API_KEY,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId || process.env.FIREBASE_PROJECT_ID,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: Constants.expoConfig?.extra?.firebaseAppId || process.env.FIREBASE_APP_ID,
  measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId || process.env.FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

// Initialize immediately so exports are available on import
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

try {
  if (typeof getReactNativePersistence === 'function') {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } else {
    // Fallback: initialize without RN persistence
    auth = initializeAuth(app);
  }
} catch {
  // On hot reload, auth may already be initialized
  try {
    auth = getAuth(app);
  } catch {
    // Last resort: initialize without persistence
    auth = initializeAuth(app);
  }
}
db = getFirestore(app);
storage = getStorage(app);

export const initializeFirebase = async () => {
  // Already initialized above, kept for backward compat
};

export { app, auth, db, storage, firebaseConfig };
