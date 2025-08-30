/**
 * Admin Tool: Set Firebase Auth Custom Claims
 * 
 * This script sets role-based custom claims for users in Firebase Auth.
 * Required for Firestore security rules to work properly.
 * 
 * Usage:
 * 1. Install Firebase Admin SDK: npm install firebase-admin
 * 2. Set up service account key (download from Firebase Console)
 * 3. Set GOOGLE_APPLICATION_CREDENTIALS environment variable
 * 4. Update the users array below with actual UIDs
 * 5. Run: node setClaims.js
 */

const admin = require("firebase-admin");

// Initialize Firebase Admin (uses GOOGLE_APPLICATION_CREDENTIALS env var)
try {
  admin.initializeApp();
  console.log("✅ Firebase Admin initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize Firebase Admin:", error.message);
  console.log("💡 Make sure GOOGLE_APPLICATION_CREDENTIALS is set to your service account key file");
  process.exit(1);
}

const setCustomClaims = async () => {
  console.log("🔧 Setting up user roles for Spectrum CRM...\n");

  // Example users - REPLACE WITH ACTUAL UIDs FROM FIREBASE AUTH
  const users = [
    { 
      uid: "REPLACE_WITH_ADMIN_UID", 
      email: "admin@example.com",
      role: "admin",
      description: "System administrator with full access"
    },
    { 
      uid: "REPLACE_WITH_FRONTDESK_UID", 
      email: "frontdesk@example.com",
      role: "frontdesk",
      description: "Front desk staff - can manage leads"
    },
    { 
      uid: "REPLACE_WITH_MARKETING_UID", 
      email: "marketing@example.com",
      role: "marketing",
      description: "Marketing team - can view campaigns"
    },
  ];

  console.log("📋 Users to update:");
  users.forEach(u => {
    console.log(`   ${u.role.toUpperCase()}: ${u.email} (${u.uid})`);
  });
  console.log("");

  try {
    for (const user of users) {
      // Check if this is a placeholder UID
      if (user.uid.startsWith("REPLACE_WITH_")) {
        console.log(`⚠️  Skipping ${user.role} - please update UID in script`);
        continue;
      }

      // Set the custom claim for this role
      const claims = {};
      claims[user.role] = true;
      
      await admin.auth().setCustomUserClaims(user.uid, claims);
      console.log(`✅ Set ${user.role} role for ${user.email}`);
      
      // Verify the claims were set
      const userRecord = await admin.auth().getUser(user.uid);
      console.log(`   Claims: ${JSON.stringify(userRecord.customClaims)}`);
    }

    console.log("\n🎉 User roles updated successfully!");
    console.log("\n📝 Next steps:");
    console.log("   1. Apply Firestore security rules in Firebase Console");
    console.log("   2. Users may need to sign out and back in for claims to take effect");
    console.log("   3. Test role-based access in the CRM application");

  } catch (error) {
    console.error("❌ Error setting custom claims:", error.message);
    
    if (error.code === 'auth/user-not-found') {
      console.log("💡 Make sure the user UIDs exist in Firebase Auth");
    } else if (error.code === 'auth/insufficient-permission') {
      console.log("💡 Make sure your service account has the required permissions");
    }
  }
};

// Helper function to list all users (useful for finding UIDs)
const listUsers = async () => {
  console.log("👥 Firebase Auth Users:");
  try {
    const listUsersResult = await admin.auth().listUsers(10);
    listUsersResult.users.forEach((userRecord) => {
      console.log(`   ${userRecord.email || 'No email'}: ${userRecord.uid}`);
    });
  } catch (error) {
    console.error("❌ Error listing users:", error.message);
  }
};

// Main execution
const main = async () => {
  console.log("🚀 Spectrum CRM - User Role Management Tool\n");
  
  // Uncomment the line below to list all users first
  // await listUsers();
  
  await setCustomClaims();
  process.exit(0);
};

main().catch((error) => {
  console.error("❌ Unexpected error:", error);
  process.exit(1);
});
