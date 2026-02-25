const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const config = require('./config');

async function addManager() {
  const connection = await mysql.createConnection(config.database);
  
  try {
    // Check if manager exists
    const [existing] = await connection.query('SELECT * FROM users WHERE username = ?', ['manager']);
    
    if (existing.length > 0) {
      console.log('Manager user already exists');
    } else {
      const hashedPassword = bcrypt.hashSync('manager123', 10);
      await connection.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['manager', hashedPassword, 'manager']);
      console.log('Manager user created successfully');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

addManager();
