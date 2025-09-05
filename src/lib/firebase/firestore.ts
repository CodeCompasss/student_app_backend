// src/lib/firebase-admin.ts
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const serviceAccountJson = process.env.FIREBASE_ADMIN_SDK_KEY;

if (!serviceAccountJson) {
  throw new Error("FIREBASE_ADMIN_SDK_KEY env var not set.");
}

const serviceAccount = JSON.parse(serviceAccountJson);

// Avoid reinitializing
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const db = getFirestore();
const bucket = getStorage().bucket();

export { db, bucket };
