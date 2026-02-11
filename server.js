const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

// Initialize MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'restaurant_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'restaurant-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

async function initDB() {
  try {
    const connection = await pool.getConnection();
    
    const [userRows] = await connection.query('SELECT COUNT(*) as count FROM users');
    if (userRows[0].count === 0) {
      const hashedAdmin = bcrypt.hashSync('admin123', 10);
      const hashedWaiter = bcrypt.hashSync('waiter123', 10);
      const hashedChef = bcrypt.hashSync('chef123', 10);
      
      await connection.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', hashedAdmin, 'admin']);
      await connection.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['waiter1', hashedWaiter, 'waiter']);
      await connection.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['chef1', hashedChef, 'chef']);
    }

    const [restaurantRows] = await connection.query('SELECT COUNT(*) as count FROM restaurant_info');
    if (restaurantRows[0].count === 0) {
      await connection.query(
        'INSERT INTO restaurant_info (id, name, address, phone, tax_rate) VALUES (1, ?, ?, ?, ?)',
        ['My Restaurant', '123 Main Street, City', '+1-234-567-8900', 5.0]
      );
    }

    const [tableRows] = await connection.query('SELECT COUNT(*) as count FROM tables');
    if (tableRows[0].count === 0) {
      for (let i = 1; i <= 10; i++) {
        await connection.query('INSERT INTO tables (table_number, capacity) VALUES (?, ?)', [i, 4]);
      }
    }

    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

initDB();

// Authentication middleware
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session.userId || !roles.includes(req.session.userRole)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// ===== AUTH ROUTES =====
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.userRole = user.role;

    res.json({
      id: user.id,
      username: user.username,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/session', (req, res) => {
  if (req.session.userId) {
    res.json({
      id: req.session.userId,
      username: req.session.username,
      role: req.session.userRole
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// ===== RESTAURANT INFO ROUTES =====
app.get('/api/restaurant', (req, res) => {
  try {
    const info = db.prepare('SELECT * FROM restaurant_info WHERE id = 1').get();
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/restaurant', requireAuth, (req, res) => {
  const { name, addressasync (req, res) => {
  const { username, password } = req.body;
  
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0]
    res.json({ message: 'Restaurant info updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== MENU ROUTES =====async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM menu_items ORDER BY category, name');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/menu', requireAuth, async (req, res) => {
  const { name, category, half_price, full_price } = req.body;
  
  try {
    const [result] = await pool.query('INSERT INTO menu_items (name, category, half_price, full_price) VALUES (?, ?, ?, ?)',
      [name, category, half_price || null, full_price]);
    res.json({ id: result.insertId, message: 'Menu item added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/menu/:id', requireAuth, async (req, res) => {
  const { name, category, half_price, full_price, available } = req.body;
  
  try {
    await pool.query('UPDATE menu_items SET name = ?, category = ?, half_price = ?, full_price = ?, available = ? WHERE id = ?',
      [name, category, half_price || null, full_price, available, req.params.id]);
    res.json({ message: 'Menu item updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/menu/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM menu_items WHERE id = ?', [req.params.id]
  }
});

app.put('/api/restaurant', requireAuth, async (req, res) => {
  const { name, address, phone, tax_rate } = req.body;
  
  try {
    await pool.query('UPDATE restaurasync (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, 
        o.id as active_order_id,
        o.status as order_status
      FROM tables t
      LEFT JOIN orders o ON t.id = o.table_id AND o.status != 'completed'
      ORDER BY t.table_number
    `);
    res.json(row
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== ORDER ROUTES =====async (req, res) => {
  const { table_id, items } = req.body;
  
  try {
    const [existingOrders] = await pool.query('SELECT id FROM orders WHERE table_id = ? AND status != ?',
      [table_id, 'completed']);
    
    if (existingOrders.length > 0) {
      return res.status(400).json({ error: 'Table already has an active order' });
    }

    const [orderResult] = await pool.query('INSERT INTO orders (table_id, waiter_id) VALUES (?, ?)',
      [table_id, req.session.userId]);
    
    const orderId = orderResult.insertId;

    let totalAmount = 0;
    for (const item of items) {
      const [menuRows] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [item.menu_item_id]);
      const menuItem = menuRows[0];
      const price = item.portion === 'half' ? menuItem.half_price : menuItem.full_price;
      totalAmount += price * item.quantity;

      await pool.query('INSERT INTO order_items (order_id, menu_item_id, `portion`, quantity, price, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.menu_item_id, item.portion, item.quantity, price, item.notes || null]);
    }

    await pool.query('UPDATE orders SET total_amount = ? WHERE id = ?', [totalAmount, orderId]);
    await pool.query('UPDATE tables SET status = ? WHERE id = ?', ['occupied', table_id]rderId);
    db.prepare('UPDATE tables SET status = ? WHERE id = ?').run('occupied', table_id);

    res.json({ id: orderId, message: 'Order created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
async (req, res) => {
  const { status } = req.query;
  
  try {
    let query = `
      SELECT o.*, 
        t.table_number,
        u.username as waiter_name
      FROM orders o
      JOIN tables t ON o.table_id = t.id
      JOIN users u ON o.waiter_id = u.id
    `;
    
    const params = [];
    if (status) {
      query += ' WHERE o.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY o.created_at DESC';
    
    const [orders] = await pool.query(query, params);
    
    for (const order of orders) {
      const [items] = await pool.query(`
        SELECT oi.*, mi.name as item_name, mi.category
        FROM order_items oi
        JOIN menu_items mi ON oi.menu_item_id = mi.id
        WHERE oi.order_id = ?
      `, [order.id]);
      order.items = items_id = ?
      `).all(order.id);
    }
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
async (req, res) => {
  try {
    const [orderRows] = await pool.query(`
      SELECT o.*, 
        t.table_number,
        u.username as waiter_name
      FROM orders o
      JOIN tables t ON o.table_id = t.id
      JOIN users u ON o.waiter_id = u.id
      WHERE o.id = ?
    `, [req.params.id]);

    const order = orderRows[0];
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const [items] = await pool.query(`
      SELECT oi.*, mi.name as item_name, mi.category
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE oi.order_id = ?
    `, [order.id]);
    order.items = items_id = ?
    `).all(order.id);

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});async (req, res) => {
  const { status } = req.body;
  
  try {
    const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    const order = orderRows[0];
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);

    if (status === 'completed') {
      await pool.query('UPDATE orders SET completed_at = NOW() WHERE id = ?', [req.params.id]);
      await pool.query('UPDATE tables SET status = ? WHERE id = ?', ['available', order.table_id]);
    }

    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/order-items/:id/status', requireRole('chef'), async (req, res) => {
  const { status } = req.body;
  
  try {
    await pool.query('UPDATE order_items SET `status` = ? WHERE id = ?', [status, req.params.id]
  try {
    db.prepare('UPDATE order_items SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ message: 'Item status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});async (req, res) => {
  try {
    const [orderRows] = await pool.query(`
      SELECT o.*, 
        t.table_number,
        u.username as waiter_name
      FROM orders o
      JOIN tables t ON o.table_id = t.id
      JOIN users u ON o.waiter_id = u.id
      WHERE o.id = ?
    `, [req.params.id]);

    const order = orderRows[0];
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const [restaurantRows] = await pool.query('SELECT * FROM restaurant_info WHERE id = 1');
    const restaurant = restaurantRows[0];
    
    const [items] = await pool.query(`
      SELECT oi.*, mi.name as item_name
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE oi.order_id = ?
    `, [order.id]);
    order.items = itemsms oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE oi.order_id = ?
    `).all(order.id);

    const subtotal = order.total_amount;
    const tax = (subtotal * restaurant.tax_rate) / 100;
    const total = subtotal + tax;

    res.json({
      restaurant,
      order,
      subtotal,
      tax,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/waiter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'waiter.html'));
});

app.get('/chef', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chef.html'));
});

app.listen(PORT, () => {
  console.log(`Restaurant Management System running on http://localhost:${PORT}`);
  console.log('\nDefault Login Credentials:');
  console.log('Admin - Username: admin, Password: admin123');
  console.log('Waiter - Username: waiter1, Password: waiter123');
  console.log('Chef - Username: chef1, Password: chef123');
});
