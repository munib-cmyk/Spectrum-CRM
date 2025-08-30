# Role-Based Access Control Setup Guide

This guide walks you through setting up secure, role-based access control for Spectrum CRM using Firebase Auth custom claims and Firestore security rules.

## 🚀 Quick Setup

### 1. Apply Firestore Security Rules
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `spectrum-crm-114-v1`
3. Navigate to **Firestore Database** → **Rules**
4. Copy the rules from `FIRESTORE_RULES.md` and paste them
5. Click **Publish**

### 2. Set Up Admin Tools
```bash
cd tools
npm install
```

### 3. Configure Service Account
1. In Firebase Console, go to **Project Settings** → **Service Accounts**
2. Click **Generate new private key**
3. Save the JSON file securely
4. Set environment variable:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
```

### 4. Find User UIDs
First, sign in to your CRM application with the Google accounts you want to assign roles to. Then check Firebase Console → Authentication → Users to get their UIDs.

### 5. Update setClaims.js
Edit `tools/setClaims.js` and replace the placeholder UIDs:
```javascript
const users = [
  { 
    uid: "YOUR_ACTUAL_ADMIN_UID", 
    email: "admin@yourdomain.com",
    role: "admin"
  },
  { 
    uid: "YOUR_ACTUAL_FRONTDESK_UID", 
    email: "frontdesk@yourdomain.com",
    role: "frontdesk"
  },
  // Add more users as needed
];
```

### 6. Set User Roles
```bash
cd tools
node setClaims.js
```

### 7. Test the System
1. Users may need to sign out and back in for claims to take effect
2. Check that role is displayed in the topbar: "Admin: user@email.com"
3. Test that role-based access works as expected

## 📋 User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **admin** | System administrator | Full access to all data and features |
| **frontdesk** | Front desk staff | Can read all data, write to leads |
| **marketing** | Marketing team | Can read campaigns, limited write access |

## 🔒 Security Features

### Collection-Level Permissions

| Collection | Admin | Frontdesk | Marketing |
|------------|-------|-----------|-----------|
| **users** | Read/Write | Read only | Read only |
| **leads** | Read/Write | Read/Write | Read only |
| **pricing** | Read/Write | Read only | Read only |
| **vendors** | Read/Write | Read only | Read only |
| **inventory** | Read/Write | Read only | Read only |
| **campaigns** | Read/Write | Read only | Read only |
| **revenue** | Read/Write | No access | No access |

### Frontend Integration

The application automatically detects user roles:
- **Global Variables**: `window.userRole` and `window.currentUser`
- **UI Updates**: Role displayed in topbar
- **Access Control**: Dashboards respect role permissions
- **Error Handling**: Graceful fallbacks for insufficient permissions

## 🛠 Troubleshooting

### Common Issues

**"Permission denied" errors:**
- Ensure Firestore rules are published
- Check that user has correct custom claims
- User may need to sign out and back in

**"Admin SDK not initialized":**
- Verify GOOGLE_APPLICATION_CREDENTIALS is set correctly
- Ensure service account has required permissions

**Claims not updating:**
- Custom claims can take up to 1 hour to propagate
- Force refresh by signing out and back in
- Check claims in Firebase Console → Authentication

### Verification Commands

```bash
# List all users and their UIDs
cd tools
node -e "
const admin = require('firebase-admin');
admin.initializeApp();
admin.auth().listUsers().then(result => {
  result.users.forEach(user => console.log(user.email, user.uid));
});
"

# Check specific user's claims
node -e "
const admin = require('firebase-admin');
admin.initializeApp();
admin.auth().getUser('USER_UID').then(user => {
  console.log('Claims:', user.customClaims);
});
"
```

## 🔄 Adding New Users

1. User signs in to CRM application via Google OAuth
2. Find their UID in Firebase Console → Authentication
3. Add them to the `users` array in `tools/setClaims.js`
4. Run `node setClaims.js`
5. User signs out and back in to receive new permissions

## 📚 Additional Resources

- [Firebase Custom Claims Documentation](https://firebase.google.com/docs/auth/admin/custom-claims)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/rules-structure)
- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)

---

✅ **Security Benefits:**
- Least privilege access control
- Role-based permissions
- Secure by default
- Centralized user management
- Frontend integration
