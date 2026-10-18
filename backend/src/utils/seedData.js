require('dotenv').config();
const db = require('../storage/jsonDb');
const bcrypt = require('bcryptjs');

async function seedIfEmpty(collection, docsFn) {
  const count = await db.count(collection, {});
  if (count > 0) {
    console.log(`${collection}: already has data, skipped`);
    return;
  }
  const docs = await docsFn();
  for (const d of docs) await db.create(collection, d);
  console.log(`${collection}: seeded ${docs.length}`);
}

async function seedSettings() {
  const existing = await db.findOne('siteSettings', { key: 'global' });
  if (existing) {
    console.log('siteSettings: already exists, skipped');
    return;
  }
  await db.create('siteSettings', {
    key: 'global',
    companyName: 'Shri Gulab Packers & Movers',
    phone: '7694064778',
    phones: ['7694064778', '9826064778', '9109564778'],
    whatsapp: '917694064778',
    email: 'shrigulabpackers@gmail.com',
    officeAddress: 'Bhopal, Madhya Pradesh, India',
    workingHours: 'Monday - Sunday, 8:00 AM - 8:00 PM',
    footerText: 'Reliable packing, moving and storage solutions.',
    socialLinks: { instagram: 'https://instagram.com/_shri_gulab_packers_' },
  });
  console.log('siteSettings: seeded');
}

async function seedAdmin() {
  const count = await db.count('adminUsers', {});
  if (count > 0) { console.log('adminUsers: already exists, skipped'); return; }
  const passwordHash = await bcrypt.hash('Admin@12345', 10);
  await db.create('adminUsers', {
    name: 'Super Admin',
    email: 'admin@moveeasy.com',
    passwordHash,
    role: 'superadmin',
    permissions: ['*'],
    isActive: true,
  });
  console.log('adminUsers: seeded');
}

function daysFromNow(n) { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }

async function run() {
  await seedAdmin();
  await seedSettings();

  await seedIfEmpty('services', async () => ([
    'Packing','Loading','Unloading','Unpacking','Household Shifting','Office Shifting','Warehouse','Vehicle Transportation','Storage',
  ].map((title, i) => ({ title, slug: title.toLowerCase().replace(/\s+/g, '-'), isPublished: true, order: i }))));

  await seedIfEmpty('locations', async () => ([
    { city: 'Bhopal (Demo)', state: 'Madhya Pradesh', pincodes: ['462001'], isActive: true, isDemo: true, order: 1 },
    { city: 'Indore (Demo)', state: 'Madhya Pradesh', pincodes: ['452001'], isActive: true, isDemo: true, order: 2 },
    { city: 'Jabalpur (Demo)', state: 'Madhya Pradesh', pincodes: ['482001'], isActive: true, isDemo: true, order: 3 },
    { city: 'Gwalior (Demo)', state: 'Madhya Pradesh', pincodes: ['474001'], isActive: true, isDemo: true, order: 4 },
    { city: 'Ujjain (Demo)', state: 'Madhya Pradesh', pincodes: ['456001'], isActive: true, isDemo: true, order: 5 },
    { city: 'Satna (Demo)', state: 'Madhya Pradesh', pincodes: ['485001'], isActive: true, isDemo: true, order: 6 },
  ]));

  await seedIfEmpty('fleetVehicles', async () => ([
    { name: 'Mini Tempo (Demo)', category: 'mini', availability: true, isDemo: true, order: 1 },
    { name: 'Medium Truck (Demo)', category: 'medium', availability: true, isDemo: true, order: 2 },
    { name: 'Large Truck (Demo)', category: 'large', availability: true, isDemo: true, order: 3 },
    { name: 'Container (Demo)', category: 'other', availability: true, isDemo: true, order: 4 },
  ]));

  await seedIfEmpty('faqs', async () => ([
    { question: 'How do I request a quote? (Demo)', answer: 'Submit the Get Free Quote form or contact us by phone. (Demo FAQ)', isVisible: true, order: 1, isDemo: true },
    { question: 'Do you provide packing? (Demo)', answer: 'Packing services are available; details confirmed on request. (Demo FAQ)', isVisible: true, order: 2, isDemo: true },
    { question: 'Can you handle office relocation? (Demo)', answer: 'Office shifting is supported; scope is finalized after survey. (Demo FAQ)', isVisible: true, order: 3, isDemo: true },
    { question: 'Is vehicle transport available? (Demo)', answer: 'Vehicle transportation is listed; confirm availability and rates with us. (Demo FAQ)', isVisible: true, order: 4, isDemo: true },
    { question: 'Do you offer storage? (Demo)', answer: 'Storage/warehouse service is listed; terms confirmed on request. (Demo FAQ)', isVisible: true, order: 5, isDemo: true },
    { question: 'How are charges calculated? (Demo)', answer: 'Charges depend on distance, volume and services; quotation provided after details. (Demo FAQ)', isVisible: true, order: 6, isDemo: true },
  ]));

  await seedIfEmpty('galleryImages', async () => ([
    { title: 'Demo move 1', image: 'https://picsum.photos/seed/sg1/600/400', isVisible: true, isDemo: true, order: 1 },
    { title: 'Demo move 2', image: 'https://picsum.photos/seed/sg2/600/400', isVisible: true, isDemo: true, order: 2 },
    { title: 'Demo move 3', image: 'https://picsum.photos/seed/sg3/600/400', isVisible: true, isDemo: true, order: 3 },
    { title: 'Demo move 4', image: 'https://picsum.photos/seed/sg4/600/400', isVisible: true, isDemo: true, order: 4 },
    { title: 'Demo move 5', image: 'https://picsum.photos/seed/sg5/600/400', isVisible: true, isDemo: true, order: 5 },
    { title: 'Demo move 6', image: 'https://picsum.photos/seed/sg6/600/400', isVisible: true, isDemo: true, order: 6 },
  ]));

  await seedIfEmpty('testimonials', async () => ([
    { name: 'Demo Customer 1', city: 'Bhopal (Demo)', rating: 5, text: 'DEMO — NOT VERIFIED: Sample feedback for UI testing only.', source: 'manual', isVerified: false, isVisible: true, isDemo: true, order: 1 },
    { name: 'Demo Customer 2', city: 'Indore (Demo)', rating: 4, text: 'DEMO — NOT VERIFIED: Sample feedback for UI testing only.', source: 'manual', isVerified: false, isVisible: true, isDemo: true, order: 2 },
    { name: 'Demo Customer 3', city: 'Jabalpur (Demo)', rating: 5, text: 'DEMO — NOT VERIFIED: Sample feedback for UI testing only.', source: 'manual', isVerified: false, isVisible: true, isDemo: true, order: 3 },
    { name: 'Demo Customer 4', city: 'Gwalior (Demo)', rating: 4, text: 'DEMO — NOT VERIFIED: Sample feedback for UI testing only.', source: 'manual', isVerified: false, isVisible: true, isDemo: true, order: 4 },
  ]));

  // inquiries seed
  const inqCount = await db.count('inquiries', {});
  if (inqCount === 0) {
    const scenarios = [
      { movingType: 'home', shipmentType: 'local', pickup: { city: 'Bhopal (Demo)', pincode: '462001', floor: '2', lift: true }, destination: { city: 'Indore (Demo)', pincode: '452001', floor: '4', lift: false }, bhk: '2BHK', status: 'new', date: daysFromNow(3) },
      { movingType: 'home', shipmentType: 'outstation', pickup: { city: 'Bhopal (Demo)', pincode: '462010', floor: '1', lift: true }, destination: { city: 'Jabalpur (Demo)', pincode: '482002', floor: '1', lift: true }, bhk: '3BHK', status: 'contacted', date: daysFromNow(7) },
      { movingType: 'office', shipmentType: 'local', pickup: { city: 'Bhopal (Demo)', pincode: '462003', floor: '3', lift: false }, destination: { city: 'Bhopal (Demo)', pincode: '462005', floor: '5', lift: true }, status: 'quoted', date: daysFromNow(5) },
      { movingType: 'fewItems', shipmentType: 'local', pickup: { city: 'Bhopal (Demo)', pincode: '462007', floor: 'Ground', lift: true }, destination: { city: 'Bhopal (Demo)', pincode: '462009', floor: '2', lift: true }, fewItemsDescription: 'Demo: 2 chairs, 1 table, 5 boxes', status: 'new', date: daysFromNow(2) },
      { movingType: 'vehicle', shipmentType: 'outstation', pickup: { city: 'Indore (Demo)', pincode: '452001', floor: '-', lift: false }, destination: { city: 'Gwalior (Demo)', pincode: '474001', floor: '-', lift: false }, vehiclePreference: 'medium', status: 'converted', date: daysFromNow(10) },
      { movingType: 'home', shipmentType: 'local', pickup: { city: 'Bhopal (Demo)', pincode: '462001', floor: '5', lift: false }, destination: { city: 'Bhopal (Demo)', pincode: '462020', floor: '2', lift: true }, bhk: '1BHK', status: 'lost', date: daysFromNow(1) },
      { movingType: 'home', shipmentType: 'outstation', pickup: { city: 'Bhopal (Demo)', pincode: '462011', floor: '2', lift: true }, destination: { city: 'Ujjain (Demo)', pincode: '456001', floor: '2', lift: true }, bhk: '4BHK', status: 'new', date: daysFromNow(14) },
      { movingType: 'office', shipmentType: 'outstation', pickup: { city: 'Bhopal (Demo)', pincode: '462016', floor: '1', lift: true }, destination: { city: 'Satna (Demo)', pincode: '485001', floor: '1', lift: false }, status: 'contacted', date: daysFromNow(9) },
      { movingType: 'fewItems', shipmentType: 'outstation', pickup: { city: 'Indore (Demo)', pincode: '452010', floor: '3', lift: true }, destination: { city: 'Gwalior (Demo)', pincode: '474010', floor: '7', lift: false }, fewItemsDescription: 'Demo: dining table, couch', status: 'quoted', date: daysFromNow(6) },
      { movingType: 'vehicle', shipmentType: 'local', pickup: { city: 'Bhopal (Demo)', pincode: '462022', floor: '-', lift: false }, destination: { city: 'Bhopal (Demo)', pincode: '462030', floor: '-', lift: false }, vehiclePreference: 'recommend', status: 'new', date: daysFromNow(4) },
      { movingType: 'home', shipmentType: 'local', pickup: { city: 'Bhopal (Demo)', pincode: '462008', floor: '4', lift: false }, destination: { city: 'Bhopal (Demo)', pincode: '462015', floor: '4', lift: false }, bhk: '2BHK', status: 'contacted', date: daysFromNow(8) },
      { movingType: 'home', shipmentType: 'outstation', pickup: { city: 'Jabalpur (Demo)', pincode: '482002', floor: '6', lift: true }, destination: { city: 'Bhopal (Demo)', pincode: '462001', floor: '2', lift: true }, bhk: '5BHK+', status: 'quoted', date: daysFromNow(12) },
    ];
    const names = ['Amit Sharma','Priya Verma','Rohan Singh','Neha Jain','Vikas Gupta','Pooja Patel','Suresh Yadav','Anita Rao','Manish Tiwari','Kavita Mishra','Rahul Khanna','Sneha Agarwal'];
    const mobiles = ['9000000001','9000000002','9000000003','9000000004','9000000005','9000000006','9000000007','9000000008','9000000009','9000000010','9000000011','9000000012'];
    const inquiryIds = [];
    for (let i = 0; i < scenarios.length; i++) {
      const s = scenarios[i];
      const inq = await db.create('inquiries', {
        movingType: s.movingType,
        shipmentType: s.shipmentType,
        pickup: s.pickup,
        destination: s.destination,
        bhk: s.bhk,
        fewItemsDescription: s.fewItemsDescription,
        vehiclePreference: s.vehiclePreference || 'recommend',
        movingDate: s.date,
        customer: { name: names[i], mobile: mobiles[i] },
        status: s.status,
        isDemo: true,
      });
      inquiryIds.push(inq._id);
      // make quotation for quoted/converted
      if (s.status === 'quoted' || s.status === 'converted') {
        await db.create('quotations', {
          inquiry: inq._id,
          estimateAmount: 5000 + (i * 2500),
          currency: 'INR',
          status: s.status === 'converted' ? 'accepted' : 'sent',
          notes: 'DEMO quotation',
          isDemo: true,
        });
      }
    }
    console.log(`inquiries: seeded ${scenarios.length}`);

    // bookings for first 5 inquiries
    const bookingStatuses = ['scheduled','inTransit','completed','cancelled','scheduled'];
    for (let i = 0; i < 5; i++) {
      await db.create('bookings', {
        bookingId: `BK-${String(i + 1).padStart(5, '0')}`,
        inquiry: inquiryIds[i],
        scheduleDate: daysFromNow(2 + i),
        driverName: `Demo Driver ${i + 1}`,
        driverPhone: `910000000${i}`,
        status: bookingStatuses[i],
        notes: 'DEMO booking',
        isDemo: true,
      });
    }
    console.log('bookings: seeded 5');
  } else {
    console.log('inquiries: already has data, skipped');
  }

  console.log('Seed complete');
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });