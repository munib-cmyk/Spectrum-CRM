const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Auth state listener
auth.onAuthStateChanged((user) => {
  updateUserUI(user);
  
  // Check admin access on admin page
  if (window.location.pathname.includes('admin.html') && (!user || !user.email)) {
    window.location.href = 'crm.html';
  }
});

// Update user UI in topbar
function updateUserUI(user) {
  const userDropdown = document.querySelector('.nav-user');
  const userImg = document.querySelector('.nav-user img');
  const userName = document.querySelector('.nav-user-name');
  
  if (user) {
    if (userImg) userImg.src = user.photoURL || 'assets/images/users/user-1.png';
    if (userName) userName.innerHTML = `${user.displayName || user.email} <i class="mdi mdi-chevron-down"></i>`;
    
    // Update dropdown menu
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (dropdownMenu) {
      dropdownMenu.innerHTML = `
        <a class="dropdown-item" href="#"><i class="ti-user text-muted mr-2"></i> Profile</a>
        <a class="dropdown-item" href="#"><i class="ti-settings text-muted mr-2"></i> Settings</a>
        <div class="dropdown-divider mb-0"></div>
        <a class="dropdown-item" href="#" onclick="signOut()"><i class="ti-power-off text-muted mr-2"></i> Logout</a>
      `;
    }
  } else {
    if (userName) userName.innerHTML = `Sign In <i class="mdi mdi-chevron-down"></i>`;
    
    // Update dropdown menu
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (dropdownMenu) {
      dropdownMenu.innerHTML = `
        <a class="dropdown-item" href="#" onclick="signInWithGoogle()"><i class="ti-user text-muted mr-2"></i> Sign in with Google</a>
      `;
    }
  }
}

// Google Sign In
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch((error) => {
    console.error('Sign in error:', error);
    alert('Sign in failed: ' + error.message);
  });
}

// Sign Out
function signOut() {
  auth.signOut().catch((error) => {
    console.error('Sign out error:', error);
  });
}
