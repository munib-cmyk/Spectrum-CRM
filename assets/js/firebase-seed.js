// Firebase Seed Script - Populate collections with dummy data
// Requires: firebase-config.js

// Main seed function - populate all collections with dummy data
async function seedData() {
  if (typeof db === 'undefined') {
    throw new Error('Firebase not initialized. Please ensure firebase-config.js is loaded.');
  }

  console.log('Starting Firestore seed operation...');
  
  try {
    const results = await Promise.all([
      seedLeads(),
      seedPricing(), 
      seedInventory(),
      seedVendors(),
      seedUsers(),
      seedCampaigns(),
      seedRevenue()
    ]);
    
    const totalInserted = results.reduce((sum, count) => sum + count, 0);
    console.log(`Seed operation completed. Total documents inserted: ${totalInserted}`);
    
    return {
      success: true,
      inserted: {
        leads: results[0],
        pricing: results[1], 
        inventory: results[2],
        vendors: results[3],
        users: results[4],
        campaigns: results[5],
        revenue: results[6],
        total: totalInserted
      }
    };
    
  } catch (error) {
    console.error('Seed operation failed:', error);
    throw error;
  }
}

// Seed leads collection with 20 dummy leads
async function seedLeads() {
  console.log('Seeding leads collection...');
  
  const leads = [
    {
      id: 'lead-1', name: 'Emily Davis', phone: '555-123-4567', email: 'emily.davis@example.com',
      source: 'Google Ads', category: 'Injectables', service: 'Botox', value: 450, priority: 'High',
      stage: 'New', created: '2025-01-10T10:00:00Z', apptDate: '2025-01-20', dueDate: '2025-01-25', dueTime: '10:30', notes: 'Interested in lip treatment'
    },
    {
      id: 'lead-2', name: 'Daniel Gomez', phone: '555-987-6543', email: 'daniel.gomez@example.com',
      source: 'Instagram', category: 'Facial', service: 'HydraFacial MD', value: 250, priority: 'Medium',
      stage: 'Follow-up', created: '2025-01-09T14:00:00Z', apptDate: '2025-01-18', dueDate: '2025-01-22', dueTime: '14:00', notes: 'Prefers weekend appointments'
    },
    {
      id: 'lead-3', name: 'Rachel Green', phone: '555-246-8101', email: 'rachel.green@example.com',
      source: 'Referral', category: 'Laser', service: 'Laser Hair Removal', value: 600, priority: 'High',
      stage: 'Converted', created: '2025-01-08T11:00:00Z', apptDate: '2025-01-15', dueDate: '2025-01-20', dueTime: '11:00', notes: 'Wants underarms and legs'
    },
    {
      id: 'lead-4', name: 'David Kim', phone: '555-135-7913', email: 'david.kim@example.com',
      source: 'Google Ads', category: 'Injectables', service: 'Sculptra', value: 1200, priority: 'High',
      stage: 'New', created: '2025-01-07T09:00:00Z', apptDate: '2025-01-17', dueDate: '2025-01-24', dueTime: '09:00', notes: 'Interested in package deal'
    },
    {
      id: 'lead-5', name: 'Lisa Wong', phone: '555-864-2097', email: 'lisa.wong@example.com',
      source: 'Other', category: 'Body', service: 'CoolSculpting', value: 2500, priority: 'Medium',
      stage: 'Follow-up', created: '2025-01-06T15:00:00Z', apptDate: '2025-01-16', dueDate: '2025-01-21', dueTime: '15:00', notes: 'Asking about session counts'
    },
    {
      id: 'lead-6', name: 'Mark Patel', phone: '555-321-7890', email: 'mark.patel@example.com',
      source: 'Instagram', category: 'Facial', service: 'Chemical Peel', value: 300, priority: 'Low',
      stage: 'Lost', created: '2025-01-05T13:00:00Z', apptDate: '', dueDate: '', dueTime: '', notes: 'Concerned about downtime'
    },
    {
      id: 'lead-7', name: 'Sophia Lee', phone: '555-741-8529', email: 'sophia.lee@example.com',
      source: 'Referral', category: 'Injectables', service: 'Lip Filler', value: 700, priority: 'High',
      stage: 'Converted', created: '2025-01-04T16:30:00Z', apptDate: '2025-01-14', dueDate: '2025-01-19', dueTime: '16:30', notes: 'First-time filler client'
    },
    {
      id: 'lead-8', name: 'James Carter', phone: '555-963-2584', email: 'james.carter@example.com',
      source: 'Google Ads', category: 'Laser', service: 'Fraxel', value: 1500, priority: 'High',
      stage: 'New', created: '2025-01-03T10:00:00Z', apptDate: '2025-01-13', dueDate: '2025-01-18', dueTime: '10:00', notes: 'Wants downtime explained'
    },
    {
      id: 'lead-9', name: 'Natalie Brooks', phone: '555-147-2580', email: 'natalie.brooks@example.com',
      source: 'Instagram', category: 'Facial', service: 'Microneedling', value: 400, priority: 'Medium',
      stage: 'Follow-up', created: '2025-01-02T12:00:00Z', apptDate: '2025-01-12', dueDate: '2025-01-17', dueTime: '12:00', notes: 'Concerned about pain level'
    },
    {
      id: 'lead-10', name: 'Michael Johnson', phone: '555-369-1470', email: 'michael.johnson@example.com',
      source: 'Other', category: 'Injectables', service: 'Kybella', value: 800, priority: 'High',
      stage: 'Converted', created: '2025-01-01T11:30:00Z', apptDate: '2025-01-11', dueDate: '2025-01-16', dueTime: '11:30', notes: 'Wants double chin treated'
    },
    {
      id: 'lead-11', name: 'Jennifer White', phone: '555-456-7890', email: 'jennifer.white@example.com',
      source: 'Referral', category: 'Body', service: 'Body Cavitation', value: 900, priority: 'Medium',
      stage: 'New', created: '2024-12-30T14:30:00Z', apptDate: '2025-01-10', dueDate: '2025-01-15', dueTime: '14:30', notes: 'Referred by friend'
    },
    {
      id: 'lead-12', name: 'Robert Chen', phone: '555-654-3210', email: 'robert.chen@example.com',
      source: 'Google Ads', category: 'Laser', service: 'Laser Hair Removal', value: 600, priority: 'Low',
      stage: 'Lost', created: '2024-12-29T09:15:00Z', apptDate: '', dueDate: '', dueTime: '', notes: 'Price sensitive'
    },
    {
      id: 'lead-13', name: 'Amanda Foster', phone: '555-789-0123', email: 'amanda.foster@example.com',
      source: 'Instagram', category: 'Injectables', service: 'Botox', value: 450, priority: 'High',
      stage: 'Follow-up', created: '2024-12-28T16:00:00Z', apptDate: '2025-01-08', dueDate: '2025-01-13', dueTime: '16:00', notes: 'Follow-up needed'
    },
    {
      id: 'lead-14', name: 'Christopher Lee', phone: '555-012-3456', email: 'christopher.lee@example.com',
      source: 'Other', category: 'Facial', service: 'HydraFacial MD', value: 250, priority: 'Medium',
      stage: 'Converted', created: '2024-12-27T13:45:00Z', apptDate: '2025-01-07', dueDate: '2025-01-12', dueTime: '13:45', notes: 'Regular client'
    },
    {
      id: 'lead-15', name: 'Michelle Taylor', phone: '555-345-6789', email: 'michelle.taylor@example.com',
      source: 'Referral', category: 'Injectables', service: 'Sculptra', value: 1200, priority: 'High',
      stage: 'New', created: '2024-12-26T10:30:00Z', apptDate: '2025-01-06', dueDate: '2025-01-11', dueTime: '10:30', notes: 'Wants natural results'
    },
    {
      id: 'lead-16', name: 'Kevin Rodriguez', phone: '555-678-9012', email: 'kevin.rodriguez@example.com',
      source: 'Google Ads', category: 'Body', service: 'CoolSculpting', value: 2500, priority: 'Low',
      stage: 'Follow-up', created: '2024-12-25T15:20:00Z', apptDate: '2025-01-05', dueDate: '2025-01-10', dueTime: '15:20', notes: 'Considering treatment'
    },
    {
      id: 'lead-17', name: 'Sarah Martinez', phone: '555-901-2345', email: 'sarah.martinez@example.com',
      source: 'Instagram', category: 'Laser', service: 'Fraxel', value: 1500, priority: 'Medium',
      stage: 'Converted', created: '2024-12-24T11:10:00Z', apptDate: '2025-01-04', dueDate: '2025-01-09', dueTime: '11:10', notes: 'Acne scarring treatment'
    },
    {
      id: 'lead-18', name: 'William Davis', phone: '555-234-5678', email: 'william.davis@example.com',
      source: 'Other', category: 'Facial', service: 'Chemical Peel', value: 300, priority: 'Low',
      stage: 'Lost', created: '2024-12-23T14:50:00Z', apptDate: '', dueDate: '', dueTime: '', notes: 'Changed mind'
    },
    {
      id: 'lead-19', name: 'Jessica Wilson', phone: '555-567-8901', email: 'jessica.wilson@example.com',
      source: 'Referral', category: 'Injectables', service: 'Lip Filler', value: 700, priority: 'High',
      stage: 'New', created: '2024-12-22T12:40:00Z', apptDate: '2025-01-02', dueDate: '2025-01-07', dueTime: '12:40', notes: 'Wants subtle enhancement'
    },
    {
      id: 'lead-20', name: 'Thomas Anderson', phone: '555-890-1234', email: 'thomas.anderson@example.com',
      source: 'Google Ads', category: 'Body', service: 'Body Cavitation', value: 900, priority: 'Medium',
      stage: 'Follow-up', created: '2024-12-21T08:30:00Z', apptDate: '2025-01-01', dueDate: '2025-01-06', dueTime: '08:30', notes: 'Needs consultation'
    }
  ];

  let insertedCount = 0;
  const batch = db.batch();

  for (const lead of leads) {
    const docRef = db.collection('leads').doc(lead.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      batch.set(docRef, lead);
      insertedCount++;
    }
  }

  if (insertedCount > 0) {
    await batch.commit();
  }

  console.log(`Inserted ${insertedCount} leads (${leads.length - insertedCount} already existed)`);
  return insertedCount;
}

// Seed pricing collection with ~10 services
async function seedPricing() {
  console.log('Seeding pricing collection...');
  
  const services = [
    { id: 'svc-1', category: 'Injectables', service: 'Botox', price: 450, duration_min: 30, sku: 'BTX-001', active: true },
    { id: 'svc-2', category: 'Injectables', service: 'Lip Filler', price: 700, duration_min: 45, sku: 'LPF-002', active: true },
    { id: 'svc-3', category: 'Injectables', service: 'Sculptra', price: 1200, duration_min: 60, sku: 'SCP-003', active: true },
    { id: 'svc-4', category: 'Injectables', service: 'Kybella', price: 800, duration_min: 40, sku: 'KBL-004', active: true },
    { id: 'svc-5', category: 'Facial', service: 'HydraFacial MD', price: 250, duration_min: 45, sku: 'HFM-005', active: true },
    { id: 'svc-6', category: 'Facial', service: 'Chemical Peel', price: 300, duration_min: 30, sku: 'CHP-006', active: true },
    { id: 'svc-7', category: 'Facial', service: 'Microneedling', price: 400, duration_min: 60, sku: 'MCL-007', active: true },
    { id: 'svc-8', category: 'Laser', service: 'Laser Hair Removal', price: 600, duration_min: 60, sku: 'LHR-008', active: true },
    { id: 'svc-9', category: 'Laser', service: 'Fraxel', price: 1500, duration_min: 90, sku: 'FRX-009', active: true },
    { id: 'svc-10', category: 'Body', service: 'CoolSculpting', price: 2500, duration_min: 60, sku: 'CLS-010', active: true },
    { id: 'svc-11', category: 'Body', service: 'Body Cavitation', price: 900, duration_min: 60, sku: 'BCV-011', active: true },
    { id: 'svc-12', category: 'Body', service: 'EMSCULPT', price: 2000, duration_min: 45, sku: 'EMS-012', active: false }
  ];

  let insertedCount = 0;
  const batch = db.batch();

  for (const service of services) {
    const docRef = db.collection('pricing').doc(service.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      const { id, ...serviceData } = service; // Remove id from data
      batch.set(docRef, serviceData);
      insertedCount++;
    }
  }

  if (insertedCount > 0) {
    await batch.commit();
  }

  console.log(`Inserted ${insertedCount} pricing records (${services.length - insertedCount} already existed)`);
  return insertedCount;
}

// Seed inventory collection with ~10 items
async function seedInventory() {
  console.log('Seeding inventory collection...');
  
  const inventory = [
    { id: 'inv-1', sku: 'BTX-001', name: 'Botox 100U', category: 'Injectables', stock: 25, threshold: 10 },
    { id: 'inv-2', sku: 'LPF-002', name: 'Lip Filler 1ml', category: 'Injectables', stock: 15, threshold: 5 },
    { id: 'inv-3', sku: 'SCP-003', name: 'Sculptra Vial', category: 'Injectables', stock: 8, threshold: 3 },
    { id: 'inv-4', sku: 'KBL-004', name: 'Kybella Vial', category: 'Injectables', stock: 12, threshold: 5 },
    { id: 'inv-5', sku: 'HFM-005', name: 'HydraFacial Serum', category: 'Facial', stock: 30, threshold: 10 },
    { id: 'inv-6', sku: 'CHP-006', name: 'Chemical Peel Kit', category: 'Facial', stock: 2, threshold: 3 },
    { id: 'inv-7', sku: 'MCL-007', name: 'Microneedling Cartridge', category: 'Facial', stock: 40, threshold: 15 },
    { id: 'inv-8', sku: 'LHR-008', name: 'Laser Hair Removal Cartridge', category: 'Laser', stock: 12, threshold: 5 },
    { id: 'inv-9', sku: 'FRX-009', name: 'Fraxel Tip', category: 'Laser', stock: 20, threshold: 5 },
    { id: 'inv-10', sku: 'CLS-010', name: 'CoolSculpting Applicator', category: 'Body', stock: 4, threshold: 1 },
    { id: 'inv-11', sku: 'BCV-011', name: 'Body Cavitation Gel', category: 'Body', stock: 18, threshold: 8 },
    { id: 'inv-12', sku: 'EMS-012', name: 'EMSCULPT Paddle', category: 'Body', stock: 0, threshold: 1 }
  ];

  let insertedCount = 0;
  const batch = db.batch();

  for (const item of inventory) {
    const docRef = db.collection('inventory').doc(item.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      const { id, ...itemData } = item; // Remove id from data
      batch.set(docRef, itemData);
      insertedCount++;
    }
  }

  if (insertedCount > 0) {
    await batch.commit();
  }

  console.log(`Inserted ${insertedCount} inventory items (${inventory.length - insertedCount} already existed)`);
  return insertedCount;
}

// Seed vendors collection with 5 vendors
async function seedVendors() {
  console.log('Seeding vendors collection...');
  
  const vendors = [
    {
      id: 'vendor-1', name: 'Allergan', category: 'Injectables', contactName: 'John Smith',
      phone: '555-111-2222', email: 'john.smith@allergan.com', terms: 'NET 30'
    },
    {
      id: 'vendor-2', name: 'Candela USA', category: 'Laser', contactName: 'Sarah Johnson',
      phone: '555-333-4444', email: 'sarah.johnson@candela.com', terms: 'NET 15'
    },
    {
      id: 'vendor-3', name: 'Zimmer Aesthetics', category: 'Body', contactName: 'Mike Lee',
      phone: '555-555-6666', email: 'mike.lee@zimmer.com', terms: 'COD'
    },
    {
      id: 'vendor-4', name: 'SkinCeuticals', category: 'Skincare', contactName: 'Laura Kim',
      phone: '555-777-8888', email: 'laura.kim@skinceuticals.com', terms: 'NET 30'
    },
    {
      id: 'vendor-5', name: 'Medline Industries', category: 'Supplies', contactName: 'David Chen',
      phone: '555-999-0000', email: 'david.chen@medline.com', terms: 'NET 15'
    }
  ];

  let insertedCount = 0;
  const batch = db.batch();

  for (const vendor of vendors) {
    const docRef = db.collection('vendors').doc(vendor.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      const { id, ...vendorData } = vendor;
      batch.set(docRef, vendorData);
      insertedCount++;
    }
  }

  if (insertedCount > 0) {
    await batch.commit();
  }

  console.log(`Inserted ${insertedCount} vendors (${vendors.length - insertedCount} already existed)`);
  return insertedCount;
}

// Seed users collection with 5 test users
async function seedUsers() {
  console.log('Seeding users collection...');
  
  const users = [
    {
      id: 'user-1', name: 'Admin User', email: 'admin@spectrumcrm.com', role: 'admin'
    },
    {
      id: 'user-2', name: 'Front Desk Manager', email: 'frontdesk@spectrumcrm.com', role: 'frontdesk'
    },
    {
      id: 'user-3', name: 'Marketing Coordinator', email: 'marketing@spectrumcrm.com', role: 'marketing'
    },
    {
      id: 'user-4', name: 'Reception Staff', email: 'reception@spectrumcrm.com', role: 'frontdesk'
    },
    {
      id: 'user-5', name: 'Social Media Manager', email: 'social@spectrumcrm.com', role: 'marketing'
    }
  ];

  let insertedCount = 0;
  const batch = db.batch();

  for (const user of users) {
    const docRef = db.collection('users').doc(user.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      const { id, ...userData } = user;
      batch.set(docRef, {
        ...userData,
        displayName: userData.name,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      insertedCount++;
    }
  }

  if (insertedCount > 0) {
    await batch.commit();
  }

  console.log(`Inserted ${insertedCount} users (${users.length - insertedCount} already existed)`);
  return insertedCount;
}

// Seed campaigns collection with 5 marketing campaigns
async function seedCampaigns() {
  console.log('Seeding campaigns collection...');
  
  const campaigns = [
    {
      id: 'camp-1', platform: 'Google Ads', budget: 5000, spend: 4200, 
      impressions: 85000, clicks: 1250, conversions: 48
    },
    {
      id: 'camp-2', platform: 'Meta', budget: 3000, spend: 2800,
      impressions: 120000, clicks: 890, conversions: 32
    },
    {
      id: 'camp-3', platform: 'Instagram', budget: 2500, spend: 2100,
      impressions: 95000, clicks: 750, conversions: 28
    },
    {
      id: 'camp-4', platform: 'Google Ads', budget: 4000, spend: 3600,
      impressions: 70000, clicks: 980, conversions: 41
    },
    {
      id: 'camp-5', platform: 'Meta', budget: 2000, spend: 1850,
      impressions: 60000, clicks: 520, conversions: 19
    }
  ];

  let insertedCount = 0;
  const batch = db.batch();

  for (const campaign of campaigns) {
    const docRef = db.collection('campaigns').doc(campaign.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      const { id, ...campaignData } = campaign;
      batch.set(docRef, campaignData);
      insertedCount++;
    }
  }

  if (insertedCount > 0) {
    await batch.commit();
  }

  console.log(`Inserted ${insertedCount} campaigns (${campaigns.length - insertedCount} already existed)`);
  return insertedCount;
}

// Seed revenue collection with monthly metrics (last 12 months)
async function seedRevenue() {
  console.log('Seeding revenue collection...');
  
  const currentDate = new Date();
  const revenues = [];
  
  // Generate last 12 months of revenue data
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(currentDate.getMonth() - i);
    const monthId = date.toISOString().slice(0, 7); // YYYY-MM format
    
    // Generate realistic revenue data with some seasonality
    const baseRevenue = 25000;
    const seasonalMultiplier = 1 + (Math.sin((date.getMonth() / 12) * 2 * Math.PI) * 0.3);
    const randomVariation = 0.8 + (Math.random() * 0.4); // ±20% variation
    
    revenues.push({
      id: monthId,
      month: monthId,
      revenue: Math.round(baseRevenue * seasonalMultiplier * randomVariation),
      patients: Math.round(30 + (Math.random() * 20)), // 30-50 patients
      cost_staff: Math.round(8000 + (Math.random() * 2000)), // $8k-10k
      cost_equipment: Math.round(3000 + (Math.random() * 1000)), // $3k-4k
      cost_consumables: Math.round(5000 + (Math.random() * 2000)) // $5k-7k
    });
  }

  let insertedCount = 0;
  const batch = db.batch();

  for (const revenue of revenues) {
    const docRef = db.collection('revenue').doc(revenue.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      const { id, ...revenueData } = revenue;
      batch.set(docRef, revenueData);
      insertedCount++;
    }
  }

  if (insertedCount > 0) {
    await batch.commit();
  }

  console.log(`Inserted ${insertedCount} revenue records (${revenues.length - insertedCount} already existed)`);
  return insertedCount;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { seedData, seedLeads, seedPricing, seedInventory, seedVendors, seedUsers, seedCampaigns, seedRevenue };
}
