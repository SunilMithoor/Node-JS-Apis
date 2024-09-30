const { initializeApp } = require("firebase/app");
const firebaseConfig = require("../config/firebaseConfig.js");

const admin = require("firebase-admin");

const path = require("path");
// Path to the service account key
const serviceAccount = require(path.join(__dirname, "../../.firebase/serviceAccountKey.json"));

// const serviceAccount = require("../../.firebase/serviceAccountKey.json");

const config = {
  apiKey: firebaseConfig.FIREBASE_API_KEY,
  authDomain: firebaseConfig.FIREBASE_AUTH_DOMAIN,
  projectId: firebaseConfig.FIREBASE_PROJECT_ID,
  storageBucket: firebaseConfig.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: firebaseConfig.FIREBASE_MESSAGING_SENDER_ID,
  appId: firebaseConfig.FIREBASE_APP_ID,
};

//Initialize a firebase application
const firebaseApp = initializeApp(config);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), 
  storageBucket: firebaseConfig.FIREBASE_STORAGE_BUCKET, // replace with your bucket name
});

const bucket = admin.storage().bucket();

module.exports = { firebaseApp, bucket };
