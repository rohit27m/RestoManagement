const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function resetPasswords() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'restaurant_management'
  });

  try {
    console.log('Resetting all user passwords...');
    
    const passwords = {
      'admin': 'admin123',
      'manager': 'manager123',
      'waiter1': 'waiter123',
      'chef1': 'chef123'
    };

    for (const [username, password] of Object.entries(passwords)) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      await connection.query(
        'UPDATE users SET password = ? WHERE username = ?',
        [hashedPassword, username]
      );
      console.log(`✓ Reset password for ${username}`);
      
      // Verify the hash works
      const [rows] = await connection.query('SELECT password FROM users WHERE username = ?', [username]);
      if (rows[0]) {
        const match = bcrypt.compareSync(password, rows[0].password);
        console.log(`  Verification: ${match ? '✓ PASS' : '✗ FAIL'}`);
      }
    }

    console.log('\nAll passwords reset successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

resetPasswords();
