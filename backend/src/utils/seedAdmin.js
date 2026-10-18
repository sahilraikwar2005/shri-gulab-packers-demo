require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../storage/jsonDb');

async function seed() {
  const email = (process.argv[2] || 'admin@moveeasy.com').toLowerCase();
  const password = process.argv[3] || 'Admin@12345';
  const existing = await db.findOne('adminUsers', { email });
  if (existing) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }
  const passwordHash = await bcrypt.hash(password, 10);
  await db.create('adminUsers', {
    name: 'Super Admin',
    email,
    passwordHash,
    role: 'superadmin',
    permissions: ['*'],
    isActive: true,
  });
  console.log('Created superadmin:', email, password);
  process.exit(0);
}
seed();