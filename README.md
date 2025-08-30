# Spectrum CRM

Spectrum CRM is a comprehensive customer relationship management system built for medical spas and wellness clinics.

## Features

- **Role-based Access Control**: Admin, Front Desk, and Marketing roles with Firebase Auth
- **CSV Import/Export**: Locked schemas for Services and Leads data
- **Real-time Dashboard**: Live analytics and reporting
- **Firestore Integration**: Cloud-based data storage and sync

## Firestore Indexes Required

For optimal performance, create the following compound indexes in Firebase Console:

### Leads Collection
```
Collection: leads
Fields: stage (Ascending), priority (Ascending)
```

```
Collection: leads  
Fields: created (Ascending), category (Ascending)
```

### Services Collection
```
Collection: services
Fields: category (Ascending), active (Ascending)
```

## Setup

1. Configure Firebase in `assets/js/firebase-config.js`
2. Deploy Firestore security rules from `firestore.rules`
3. Create required indexes in Firebase Console
4. Import sample data from `assets/data/` directory

## Development

- Main admin interface: `admin.html`
- Dashboard pages: `crm.html`, `marketing.html`, `financial.html`, `operations.html`, `sales.html`
- Test data: `assets/data/services-sample.csv`, `assets/data/leads-sample.csv`

## Schema

See `firebase-schema.md` for complete Firestore collection schemas.
