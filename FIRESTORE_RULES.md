# Firestore Security Rules for Spectrum CRM

## Overview
This document contains the security rules that must be applied in the Firebase Console to implement role-based access control for the Spectrum CRM application.

## Security Rules

Copy and paste the following rules into Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Leads
    match /leads/{leadId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (
        request.auth.token.admin == true ||
        request.auth.token.frontdesk == true
      );
    }

    // Pricing
    match /pricing/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Vendors, Inventory
    match /vendors/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /inventory/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Campaigns & Revenue (marketing + admin)
    match /campaigns/{docId} {
      allow read: if request.auth != null && (
        request.auth.token.admin == true || request.auth.token.marketing == true
      );
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /revenue/{docId} {
      allow read: if request.auth != null && request.auth.token.admin == true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Role-Based Access Control

### User Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| **admin** | System administrator | Full read/write access to all collections |
| **frontdesk** | Front desk staff | Can read all, write to leads only |
| **marketing** | Marketing team | Can read campaigns, limited write access |

### Collection Permissions

| Collection | Read Access | Write Access |
|------------|-------------|--------------|
| **users** | All authenticated users | Admin only |
| **leads** | All authenticated users | Admin + Frontdesk |
| **pricing** | All authenticated users | Admin only |
| **vendors** | All authenticated users | Admin only |
| **inventory** | All authenticated users | Admin only |
| **campaigns** | Admin + Marketing | Admin only |
| **revenue** | Admin only | Admin only |

## Implementation Steps

### 1. Apply Security Rules
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `spectrum-crm-114-v1`
3. Navigate to Firestore Database → Rules
4. Replace existing rules with the rules above
5. Click "Publish"

### 2. Set User Claims
Use the admin tool in `tools/setClaims.js` to assign roles to users:

```bash
cd tools
node setClaims.js
```

### 3. Verify Implementation
- Test that users can only access data according to their role
- Check that unauthorized access is properly denied
- Ensure the frontend handles role-based permissions correctly

## Security Benefits

✅ **Least Privilege Access**: Users only get minimum required permissions  
✅ **Role-Based Control**: Different access levels for different user types  
✅ **Collection-Specific Rules**: Tailored permissions for each data type  
✅ **Default Deny**: Secure by default for undefined collections  
✅ **Admin Controls**: Centralized user management through custom claims  

## Important Notes

- **Custom Claims Required**: These rules depend on Firebase Auth custom claims
- **Admin Setup**: At least one admin user must be set up initially
- **Frontend Integration**: The application automatically detects user roles
- **Testing**: Always test rules in Firebase Console before deploying to production
