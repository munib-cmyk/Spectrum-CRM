const firebaseConfig = {
  apiKey: "AIzaSyDUMMYKEYREPLACE",
  authDomain: "spectrum-crm.firebaseapp.com",
  projectId: "spectrum-crm",
  storageBucket: "spectrum-crm.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123def456",
  measurementId: "G-XXXXXXX"
};

export { firebaseConfig };

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

// Firestore Query Functions for Dashboard Reporting
async function getActiveServicesByCategory(category = null) {
  try {
    let query = db.collection('services').where('active', '==', true);
    if (category) {
      query = query.where('category', '==', category);
    }
    const snapshot = await query.get();
    const services = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      services.push({
        service: data.service,
        price: data.price,
        category: data.category
      });
    });
    return services;
  } catch (error) {
    console.error('Error fetching active services:', error);
    return [];
  }
}

async function getLeadsByStage(stage) {
  try {
    const snapshot = await db.collection('leads').where('stage', '==', stage).get();
    const leads = [];
    snapshot.forEach(doc => {
      leads.push({ id: doc.id, ...doc.data() });
    });
    return leads;
  } catch (error) {
    console.error('Error fetching leads by stage:', error);
    return [];
  }
}

async function getLeadsByDateRange(startDate, endDate) {
  try {
    const snapshot = await db.collection('leads')
      .where('created', '>=', startDate)
      .where('created', '<=', endDate)
      .get();
    const leads = [];
    snapshot.forEach(doc => {
      leads.push({ id: doc.id, ...doc.data() });
    });
    return leads;
  } catch (error) {
    console.error('Error fetching leads by date range:', error);
    return [];
  }
}

async function getRevenueSummary() {
  try {
    const convertedLeads = await getLeadsByStage('Converted');
    const totalRevenue = convertedLeads.reduce((sum, lead) => {
      return sum + (parseFloat(lead.value) || 0);
    }, 0);
    return {
      totalRevenue,
      convertedCount: convertedLeads.length,
      leads: convertedLeads
    };
  } catch (error) {
    console.error('Error calculating revenue summary:', error);
    return { totalRevenue: 0, convertedCount: 0, leads: [] };
  }
}

async function getLeadsBySource() {
  try {
    const snapshot = await db.collection('leads').get();
    const sourceMap = {};
    snapshot.forEach(doc => {
      const data = doc.data();
      const source = data.source || 'Unknown';
      if (!sourceMap[source]) {
        sourceMap[source] = 0;
      }
      sourceMap[source]++;
    });
    return sourceMap;
  } catch (error) {
    console.error('Error fetching leads by source:', error);
    return {};
  }
}

// Additional query functions for dashboard KPIs
async function getLeadsGroupedBy(field) {
  try {
    const snapshot = await db.collection('leads').get();
    const groupMap = {};
    snapshot.forEach(doc => {
      const data = doc.data();
      const value = data[field] || 'Unknown';
      if (!groupMap[value]) {
        groupMap[value] = 0;
      }
      groupMap[value]++;
    });
    return groupMap;
  } catch (error) {
    console.error(`Error fetching leads grouped by ${field}:`, error);
    return {};
  }
}

async function getMonthlyRevenue() {
  try {
    const convertedLeads = await getLeadsByStage('Converted');
    const monthlyData = {};
    
    convertedLeads.forEach(lead => {
      const created = lead.created || '';
      const month = created.substring(0, 7); // YYYY-MM format
      if (month) {
        if (!monthlyData[month]) {
          monthlyData[month] = 0;
        }
        monthlyData[month] += parseFloat(lead.value) || 0;
      }
    });
    
    // Convert to array format for charts
    return Object.entries(monthlyData)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month));
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    return [];
  }
}

async function getProjects() {
  try {
    const snapshot = await db.collection('projects').get();
    const projects = [];
    snapshot.forEach(doc => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// CSV Upload helpers for admin.html
async function upsertService(row) {
  try {
    // Use SKU as doc ID if present, else slugified service name
    const docId = row.sku || row.service.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    await db.collection('pricing').doc(docId).set({
      category: row.category || '',
      service: row.service || '',
      price: parseFloat(row.price) || 0,
      duration_min: parseInt(row.duration_min) || 0,
      sku: row.sku || '',
      active: row.active === 'true' || row.active === true
    });
    return docId;
  } catch (error) {
    console.error('Error upserting service:', error);
    throw error;
  }
}

async function upsertLead(row) {
  try {
    const leadId = row.id || generateUUID();
    await db.collection('leads').doc(leadId).set({
      id: leadId,
      name: row.name || '',
      phone: row.phone || '',
      email: row.email || '',
      source: row.source || '',
      category: row.category || '',
      service: row.service || '',
      value: parseFloat(row.value) || 0,
      priority: row.priority || '',
      stage: row.stage || 'New',
      created: row.created || new Date().toISOString(),
      apptDate: row.apptDate || '',
      dueDate: row.dueDate || '',
      dueTime: row.dueTime || '',
      notes: row.notes || ''
    });
    return leadId;
  } catch (error) {
    console.error('Error upserting lead:', error);
    throw error;
  }
}

async function deleteInactiveServices(activeServiceIds) {
  try {
    const batch = db.batch();
    const snapshot = await db.collection('pricing').get();
    
    snapshot.forEach(doc => {
      if (!activeServiceIds.includes(doc.id)) {
        batch.delete(doc.ref);
      }
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error deleting inactive services:', error);
    throw error;
  }
}

async function getAllServices() {
  try {
    const snapshot = await db.collection('pricing').get();
    const services = [];
    snapshot.forEach(doc => {
      services.push({ id: doc.id, ...doc.data() });
    });
    return services;
  } catch (error) {
    console.error('Error fetching all services:', error);
    return [];
  }
}

async function getAllLeads() {
  try {
    const snapshot = await db.collection('leads').get();
    const leads = [];
    snapshot.forEach(doc => {
      leads.push({ id: doc.id, ...doc.data() });
    });
    return leads;
  } catch (error) {
    console.error('Error fetching all leads:', error);
    return [];
  }
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
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
