// Firebase configuration for Spectrum CRM
const firebaseConfig = {
  apiKey: "AIzaSyCJPxt8qFHVD3yUvZU9xuSGPiAhmqzzcv8",
  authDomain: "spectrum-crm-114-v1.firebaseapp.com",
  projectId: "spectrum-crm-114-v1",
  storageBucket: "spectrum-crm-114-v1.appspot.com",
  messagingSenderId: "165466187606",
  appId: "1:165466187606:web:d556d645931ac4f12518f7",
  measurementId: "G-G41W3Y4DQF"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Optional: Google Auth Provider
const provider = new firebase.auth.GoogleAuthProvider();

// Expose globally
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDB = db;
window.firebaseProvider = provider;

console.log("✅ Firebase initialized in compat mode");