const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const initializeDatabase = async () => {
  // First, create a connection without specifying a database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
  });

  try {
    console.log('🔧 Initializing HelpLink Database...\n');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'helplink_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✓ Database '${dbName}' ready`);

    // Switch to the HelpLink database
    await connection.query(`USE ${dbName}`);

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split and execute each statement
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      await connection.query(statement);
    }
    console.log('✓ Database schema created/updated');

    // Seed admin account
    const bcrypt = require('bcrypt');
    const adminPassword = '123@123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Check if admin exists
    const [existingAdmin] = await connection.query(
      'SELECT id FROM users WHERE username = ?',
      ['administrative']
    );

    if (existingAdmin.length === 0) {
      await connection.query(
        'INSERT INTO users (username, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
        ['administrative', 'System Administrator', 'admin@helplink.local', hashedPassword, 'admin']
      );
      console.log('✓ Admin account created');
      console.log('\n  Credentials:');
      console.log('    Username: administrative');
      console.log('    Password: 123@123');
    } else {
      console.log('✓ Admin account already exists');
    }

    console.log('\n✓ Database initialization complete!\n');

  } catch (error) {
    console.error('✗ Initialization failed:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
};

// Run if executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = initializeDatabase;
