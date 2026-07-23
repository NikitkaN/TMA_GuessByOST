import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as path from 'path';

const serviceAccountPath = path.resolve(__dirname, 'serviceAccountKey.json');
const app = initializeApp({
  credential: cert(serviceAccountPath)   // cert импортирован из firebase-admin/app
});

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };