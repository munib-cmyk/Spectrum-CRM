// Firebase configuration - Compat mode globals only
// Note: This file expects Firebase compat scripts to be loaded in HTML before this script

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJPxt8qFHVD3yUvZU9xuSGPiAhmqzzcv8",
  authDomain: "spectrum-crm-114-v1.firebaseapp.com",
  projectId: "spectrum-crm-114-v1",
  storageBucket: "spectrum-crm-114-v1.firebasestorage.app",
  messagingSenderId: "165466187606",
  appId: "1:165466187606:web:d556d645931ac4f12518f7",
  measurementId: "G-G41W3Y4DQF"
};

// Initialize Firebase (compat mode) - Use global constants
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Expose globals for all pages (essential for compat mode)
window.app = app;
window.auth = auth;
window.db = db;

// Google Sign-In helper
window.signInWithGoogle = function() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(err => console.error("Auth error:", err));
};

window.signOutUser = function() {
  auth.signOut();
};

// Update UI on auth state changes
auth.onAuthStateChanged(user => {
  const el = document.getElementById("authStatus");
  if (!el) return;
  if (user) {
    el.innerHTML = `Signed in as ${user.email} <button onclick="signOutUser()">Sign Out</button>`;
  } else {
    el.innerHTML = `<button onclick="signInWithGoogle()">Sign in with Google</button>`;
  }
});

console.log("✅ Firebase initialized in compat mode");