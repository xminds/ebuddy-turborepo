import * as admin from 'firebase-admin';
import * as path from 'path';

// Resolve the path for the service account key
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);

try {
  // Initialize Firebase Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://ebuddy-2b8dc-default-rtdb.firebaseio.com',
  });

  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('🔥 Error initializing Firebase:', error);
  process.exit(1); // Exit the process if Firebase fails to initialize
}

const db = admin.firestore();
const auth = admin.auth(); // Export Firebase authentication

export { db, auth };
