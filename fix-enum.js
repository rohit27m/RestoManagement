const mysql = require('mysql2/promise');
const config = require('./config');

async function addManagerToEnum() {
  const connection = await mysql.createConnection(config.database);
  
  try {
    // Alter the ENUM to include 'manager'
    await connection.query("ALTER TABLE users MODIFY COLUMN role ENUM('waiter', 'chef', 'admin', 'manager') NOT NULL");
    console.log('Added manager to role ENUM');
    
    // Now update the manager user
    await connection.query("UPDATE users SET role = 'manager' WHERE username = 'manager'");
    console.log('Updated manager role');
    
    // Verify
    const [users] = await connection.query('SELECT username, role FROM users');
    console.log('All users:', users);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

addManagerToEnum();
