const mysql = require('mysql2/promise');
const config = require('./config');

async function fixManagerRole() {
  const connection = await mysql.createConnection(config.database);
  
  try {
    // Update manager role
    const [result] = await connection.query('UPDATE users SET role = ? WHERE username = ?', ['manager', 'manager']);
    console.log('Manager role updated. Rows affected:', result.affectedRows);
    
    // Verify
    const [users] = await connection.query('SELECT username, role FROM users WHERE username = ?', ['manager']);
    console.log('Manager user:', users[0]);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

fixManagerRole();
