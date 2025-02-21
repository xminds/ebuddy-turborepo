import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

// Read emulator ports from firebase.json
const firebaseConfigPath = path.resolve(__dirname, '../../firebase.json');
let firestorePort = '8080';
let authPort = '9099';

if (fs.existsSync(firebaseConfigPath)) {
  try {
    const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf-8'));
    firestorePort = firebaseConfig.emulators?.firestore?.port?.toString() || firestorePort;
    authPort = firebaseConfig.emulators?.auth?.port?.toString() || authPort;
  } catch (error) {
    console.error('⚠️ Error reading firebase.json:', error);
  }
}

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: process.env.FIREBASE_EMULATOR === 'true'
        ? admin.credential.applicationDefault()
        : admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)),
      databaseURL: process.env.FIREBASE_DATABASE_URL || `http://localhost:${firestorePort}`,
    });

    console.log('Firebase initialized successfully');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  process.exit(1);
}

const db = admin.firestore();
const auth = admin.auth();

if (process.env.FIREBASE_EMULATOR === 'true') {
  db.settings({
    host: `localhost:${firestorePort}`,
    ssl: false,
  });

  process.env.FIREBASE_AUTH_EMULATOR_HOST = `localhost:${authPort}`;

  console.log(`Using Firebase Emulator: Firestore (${firestorePort}), Auth (${authPort})`);
}

export { db, auth };
