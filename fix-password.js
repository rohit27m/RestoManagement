const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function fixPasswords() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'restaurant_management',
  });

  try {
    const connection = await pool.getConnection();
    
    // Hash all passwords
    const hashedAdmin = bcrypt.hashSync('admin123', 10);
    const hashedWaiter = bcrypt.hashSync('waiter123', 10);
    const hashedChef = bcrypt.hashSync('chef123', 10);
    
    // Update all passwords
    await connection.query('UPDATE users SET password = ? WHERE username = ?', [hashedAdmin, 'admin']);
    await connection.query('UPDATE users SET password = ? WHERE username = ?', [hashedWaiter, 'waiter1']);
    await connection.query('UPDATE users SET password = ? WHERE username = ?', [hashedChef, 'chef1']);
    
    console.log('✓ All passwords fixed successfully!');
    console.log('✓ admin can login with: admin123');
    console.log('✓ waiter1 can login with: waiter123');
    console.log('✓ chef1 can login with: chef123');
    
    connection.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error fixing passwords:', error.message);
    process.exit(1);
  }
}

fixPasswords();
