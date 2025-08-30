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
auth.onAuthStateChanged(async (user) => {
  if (user) {
    // Fetch user role from Firestore
    try {
      const doc = await db.collection('users').doc(user.uid).get();
      let role;
      
      if (doc.exists) {
        role = doc.data().role;
      } else {
        // Create new user with default role
        role = 'frontdesk';
        await db.collection('users').doc(user.uid).set({
          email: user.email,
          displayName: user.displayName,
          role: role,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
      
      window.currentRole = role;
      updateUserUI(user, role);
    } catch (error) {
      console.error('Error fetching user role:', error);
      window.currentRole = 'frontdesk';
      updateUserUI(user, 'frontdesk');
    }
  } else {
    window.currentRole = null;
    updateUserUI(user);
  }
});

// Update user UI in topbar
function updateUserUI(user, role) {
  const userDropdown = document.querySelector('.nav-user');
  const userImg = document.querySelector('.nav-user img');
  const userName = document.querySelector('.nav-user-name');
  
  if (user) {
    if (userImg) userImg.src = user.photoURL || 'assets/images/users/user-1.png';
    const roleDisplay = role ? ` (${role.charAt(0).toUpperCase() + role.slice(1)})` : '';
    if (userName) userName.innerHTML = `${user.displayName || user.email}${roleDisplay} <i class="mdi mdi-chevron-down"></i>`;
    
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

// Role management functions
async function updateUserRole(uid, newRole) {
  try {
    await db.collection('users').doc(uid).update({
      role: newRole,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
}

async function getAllUsers() {
  try {
    const snapshot = await db.collection('users').get();
    const users = [];
    snapshot.forEach(doc => {
      users.push({ uid: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
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
