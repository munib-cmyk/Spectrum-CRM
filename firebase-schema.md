# Firestore Schema — Spectrum CRM

## users
- email: string
- displayName: string
- role: "admin" | "frontdesk" | "marketing"
- createdAt: timestamp
- lastLogin: timestamp

## pricing
- category: string
- service: string
- price: number
- duration_min: number
- sku: string (doc ID)
- active: boolean
- updatedBy: uid
- updatedAt: timestamp

## leads
- id: string (doc ID)
- name, phone, email, source, category, service
- value: number
- priority: "high" | "medium" | "low"
- stage: "new" | "followup" | "converted" | "lost"
- created: timestamp
- apptDate: timestamp
- dueDate: timestamp
- dueTime: string
- notes: string
- createdBy: uid
- assignedTo: uid

## followups
- leadId: string (reference to leads)
- dueDate: timestamp
- dueTime: string
- status: "pending" | "done"
- notes: string
- createdBy: uid
- updatedAt: timestamp

## rebookings
- patientId: string
- treatment: string
- lastAppointment: timestamp
- rebookDue: timestamp
- status: "upcoming" | "due" | "overdue" | "booked"
- createdBy: uid
- updatedAt: timestamp

## inventory
- name: string
- category: string
- quantity: number
- reorderLevel: number
- unitCost: number
- updatedBy: uid
- updatedAt: timestamp

## vendors
- name: string
- contact: string
- phone: string
- email: string
- notes: string
- createdBy: uid
- updatedAt: timestamp

## projects
- title: string
- platform: "instagram" | "facebook" | "gmb" | "website"
- content: string
- scheduledFor: timestamp
- createdBy: uid
- status: "draft" | "scheduled" | "posted"
- updatedAt: timestamp
