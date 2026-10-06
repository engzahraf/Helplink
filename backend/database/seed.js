const bcrypt = require('bcrypt');
const { pool } = require('../config/database');
require('dotenv').config();

const seedDatabase = async () => {
  const connection = await pool.getConnection();
  try {
    console.log('🌱 Seeding database...\n');

    // Hash admin password
    const adminPassword = '123@123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Check if admin already exists
    const [existingAdmin] = await connection.query(
      'SELECT id FROM users WHERE username = ?',
      ['administrative']
    );

    if (existingAdmin.length > 0) {
      console.log('✓ Admin account already exists. Skipping creation.');
      return;
    }

    // Create admin account
    const [result] = await connection.query(
      'INSERT INTO users (username, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      ['administrative', 'System Administrator', 'admin@helplink.local', hashedPassword, 'admin']
    );

    console.log('✓ Admin account created successfully');
    console.log('\nAdmin Credentials:');
    console.log('  Username: administrative');
    console.log('  Password: 123@123');
    console.log('  Role: admin');
    console.log('\n⚠️  NOTE: Change this password after first login!\n');

  } catch (error) {
    console.error('✗ Seeding failed:', error.message);
    throw error;
  } finally {
    connection.release();
  }
};

// Run seed if executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✓ Database seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('✗ Database seeding failed');
      process.exit(1);
    });
}

module.exports = seedDatabase;
