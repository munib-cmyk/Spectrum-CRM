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

  // Update UI on auth state changes and detect user role
  auth.onAuthStateChanged(async (user) => {
    const el = document.getElementById("authStatus");
    
    if (user) {
      // Get user's custom claims to determine role
      try {
        const idTokenResult = await user.getIdTokenResult();
        const claims = idTokenResult.claims;
        
        // Determine user role from custom claims
        window.userRole = claims.admin 
          ? "admin" 
          : claims.frontdesk 
          ? "frontdesk" 
          : claims.marketing 
          ? "marketing" 
          : "unknown";
        
        console.log(`✅ Logged in as ${user.email} with role: ${window.userRole}`);
        
        // Update auth status UI
        if (el) {
          const roleDisplayMap = {
            admin: "Admin",
            frontdesk: "Front Desk",
            marketing: "Marketing",
            unknown: "User"
          };
          
          el.innerHTML = `
            <span style="margin-right: 10px;">
              ${roleDisplayMap[window.userRole]}: ${user.email}
            </span>
            <button onclick="signOutUser()" class="btn btn-sm btn-outline-light">Sign Out</button>
          `;
        }
        
        // Store user info globally for dashboard access
        window.currentUser = {
          uid: user.uid,
          email: user.email,
          role: window.userRole,
          claims: claims
        };
        
      } catch (error) {
        console.error("Error getting user claims:", error);
        window.userRole = "unknown";
        window.currentUser = null;
      }
    } else {
      // User signed out
      window.userRole = null;
      window.currentUser = null;
      
      if (el) {
        el.innerHTML = `<button onclick="signInWithGoogle()" class="btn btn-sm btn-primary">Sign in with Google</button>`;
      }
      
      console.log("User signed out");
    }
  });

  console.log("✅ Firebase initialized in compat mode with role detection");