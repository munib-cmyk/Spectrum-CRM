// firebase-config.js
// ✅ Firebase v9 compat mode, no ESM imports, safe globals

(function() {
  // Inject compat scripts if not already loaded
  if (typeof firebase === "undefined") {
    document.write(`
      <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"><\/script>
      <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-auth-compat.js"><\/script>
      <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js"><\/script>
    `);
  }

  window.addEventListener("load", () => {
    if (typeof firebase === "undefined") {
      console.error("❌ Firebase SDK failed to load.");
      return;
    }

    const firebaseConfig = {
      apiKey: "AIzaSyCJPxt8qFHVD3yUvZU9xuSGPiAhmqzzcv8",
      authDomain: "spectrum-crm-114-v1.firebaseapp.com",
      projectId: "spectrum-crm-114-v1",
      storageBucket: "spectrum-crm-114-v1.firebasestorage.app",
      messagingSenderId: "165466187606",
      appId: "1:165466187606:web:d556d645931ac4f12518f7",
      measurementId: "G-G41W3Y4DQF"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    console.log("✅ Firebase initialized in compat mode");

    // Expose globals
    window.auth = firebase.auth();
    window.db = firebase.firestore();

    // Google Sign-In
    window.signInWithGoogle = function() {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider).catch(err => console.error("Auth error:", err));
    };

    window.signOutUser = function() {
      auth.signOut();
    };

    // Update UI on login state
    auth.onAuthStateChanged(user => {
      const el = document.getElementById("authStatus");
      if (!el) return;
      if (user) {
        el.innerHTML = `Signed in as ${user.email} <button onclick="signOutUser()">Sign Out</button>`;
      } else {
        el.innerHTML = `<button onclick="signInWithGoogle()">Sign in with Google</button>`;
      }
    });
  });
})();