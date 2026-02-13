const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const stripe = require('./stripe-mock');
const emailService = require('./email-service');
const { generateToken, verifyToken } = require('./lib/jwt');
const { authMiddleware, roleMiddleware, restaurantAccessMiddleware } = require('./lib/middleware');

const app = express();
const PORT = 4000;

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
app.use(cors({
  origin: 'http://localhost:3000', // Next.js dev server
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'restaurant-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax',
    secure: false // set to true in production with HTTPS
  }
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
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Session-based auth (legacy)
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.userRole = user.role;

    // JWT auth (new)
    const token = generateToken({
      userId: user.id,
      email: user.username,
      role: user.role,
      restaurantId: user.restaurant_id
    });

    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      token,
      restaurantId: user.restaurant_id
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
app.get('/api/restaurant', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM restaurant_info WHERE id = 1');
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/restaurant', requireAuth, async (req, res) => {
  const { name, address, phone, tax_rate } = req.body;
  
  try {
    await pool.query('UPDATE restaurant_info SET name = ?, address = ?, phone = ?, tax_rate = ? WHERE id = 1',
      [name, address, phone, tax_rate]);
    res.json({ message: 'Restaurant info updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== MENU ROUTES =====
app.get('/api/menu', async (req, res) => {
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
    await pool.query('DELETE FROM menu_items WHERE id = ?', [req.params.id]);
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== TABLE ROUTES =====
app.get('/api/tables', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, 
        o.id as active_order_id,
        o.status as order_status
      FROM tables t
      LEFT JOIN orders o ON t.id = o.table_id AND o.status != 'completed'
      ORDER BY t.table_number
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== ORDER ROUTES =====
app.post('/api/orders', requireRole('waiter', 'admin'), async (req, res) => {
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
    await pool.query('UPDATE tables SET status = ? WHERE id = ?', ['occupied', table_id]);

    res.json({ id: orderId, message: 'Order created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/orders', requireAuth, async (req, res) => {
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
      order.items = items;
    }
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/orders/:id', requireAuth, async (req, res) => {
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
    order.items = items;

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});app.patch('/api/orders/:id/status', requireRole('waiter', 'admin'), async (req, res) => {
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

app.patch('/api/order-items/:id/status', requireRole('chef', 'admin'), async (req, res) => {
  const { status } = req.body;
  
  try {
    await pool.query('UPDATE order_items SET `status` = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Item status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});app.get('/api/orders/:id/bill', requireAuth, async (req, res) => {
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
    order.items = items;

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

// ===== PAYMENT ROUTES =====

// Create payment token (PCI-compliant tokenization)
app.post('/api/payment/tokenize', requireAuth, async (req, res) => {
  const { paymentMethod, customerEmail, customerName } = req.body;
  
  try {
    // Create token via Stripe
    const token = await stripe.createToken(paymentMethod);
    
    // Store token in database
    let tokenData = {
      customer_email: customerEmail,
      customer_name: customerName,
      payment_method_type: paymentMethod.type,
      token: token.id
    };

    if (paymentMethod.type === 'card') {
      tokenData.last_four = token.card.last4;
      tokenData.card_brand = token.card.brand;
    } else if (paymentMethod.type === 'upi') {
      tokenData.upi_id = token.upi.vpa;
    } else if (paymentMethod.type === 'wallet') {
      tokenData.wallet_provider = paymentMethod.wallet.provider;
    }

    const [result] = await pool.query('INSERT INTO payment_tokens SET ?', tokenData);

    res.json({
      tokenId: result.insertId,
      token: token.id,
      message: 'Payment method tokenized successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate split bill
app.post('/api/payment/calculate-split', requireAuth, async (req, res) => {
  const { orderId, numberOfSplits, customSplits } = req.body;
  
  try {
    // Get order details
    const [orderRows] = await pool.query(`
      SELECT o.*, 
        t.table_number,
        u.username as waiter_name
      FROM orders o
      JOIN tables t ON o.table_id = t.id
      JOIN users u ON o.waiter_id = u.id
      WHERE o.id = ?
    `, [orderId]);

    const order = orderRows[0];
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const [restaurantRows] = await pool.query('SELECT * FROM restaurant_info WHERE id = 1');
    const restaurant = restaurantRows[0];

    const subtotal = order.total_amount;
    const tax = (subtotal * restaurant.tax_rate) / 100;
    const tipAmount = order.tip_amount || 0;
    const total = subtotal + tax + tipAmount;

    let splits = [];

    if (customSplits && customSplits.length > 0) {
      // Custom split amounts
      splits = customSplits.map(split => ({
        amount: parseFloat(split.amount),
        percentage: (parseFloat(split.amount) / total * 100).toFixed(2),
        payerName: split.payerName || null
      }));
    } else {
      // Equal split
      const splitAmount = (total / numberOfSplits).toFixed(2);
      for (let i = 0; i < numberOfSplits; i++) {
        splits.push({
          amount: parseFloat(splitAmount),
          percentage: (100 / numberOfSplits).toFixed(2),
          payerName: null
        });
      }
    }

    res.json({
      orderId,
      subtotal,
      tax,
      tipAmount,
      total,
      numberOfSplits: splits.length,
      splits
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate tip
app.post('/api/payment/calculate-tip', requireAuth, async (req, res) => {
  const { orderId, tipPercentage, customTipAmount } = req.body;
  
  try {
    const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    const order = orderRows[0];
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const [restaurantRows] = await pool.query('SELECT * FROM restaurant_info WHERE id = 1');
    const restaurant = restaurantRows[0];

    const subtotal = order.total_amount;
    const tax = (subtotal * restaurant.tax_rate) / 100;
    const billTotal = subtotal + tax;

    let tipAmount = 0;
    if (customTipAmount !== undefined && customTipAmount !== null) {
      tipAmount = parseFloat(customTipAmount);
    } else if (tipPercentage) {
      tipAmount = (billTotal * tipPercentage / 100);
    }

    const finalTotal = billTotal + tipAmount;

    res.json({
      subtotal,
      tax,
      billTotal,
      tipAmount: parseFloat(tipAmount.toFixed(2)),
      tipPercentage: tipPercentage || ((tipAmount / billTotal) * 100).toFixed(2),
      finalTotal: parseFloat(finalTotal.toFixed(2))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Process payment
app.post('/api/payment/process', requireAuth, async (req, res) => {
  const { 
    orderId, 
    paymentMethod, 
    amount, 
    tipAmount, 
    paymentToken,
    customerEmail,
    customerName,
    splits,
    notes
  } = req.body;
  
  try {
    // Validate order
    const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    const order = orderRows[0];
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Create payment intent with Stripe
    let stripePaymentIntent = null;
    let transactionId = null;

    if (['card', 'upi', 'wallet'].includes(paymentMethod)) {
      stripePaymentIntent = await stripe.createPaymentIntent({
        amount: amount,
        currency: 'inr',
        metadata: {
          orderId: orderId,
          restaurantName: 'My Restaurant'
        }
      });

      // Confirm payment
      const confirmation = await stripe.confirmPayment(stripePaymentIntent.id, {
        type: paymentMethod,
        amount: amount
      });

      transactionId = confirmation.charges.data[0].id;
    } else if (paymentMethod === 'cash') {
      transactionId = `cash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Insert payment record
    const paymentData = {
      order_id: orderId,
      payment_method: paymentMethod,
      amount: amount,
      tip_amount: tipAmount || 0,
      status: 'completed',
      transaction_id: transactionId,
      stripe_payment_intent_id: stripePaymentIntent ? stripePaymentIntent.id : null,
      customer_email: customerEmail,
      customer_name: customerName,
      notes: notes,
      processed_by: req.session.userId,
      processed_at: new Date()
    };

    const [paymentResult] = await pool.query('INSERT INTO payments SET ?', paymentData);
    const paymentId = paymentResult.insertId;

    // Handle split payments
    if (splits && splits.length > 0) {
      for (const split of splits) {
        await pool.query('INSERT INTO payment_splits SET ?', {
          payment_id: paymentId,
          split_amount: split.amount,
          split_percentage: split.percentage,
          payer_name: split.payerName,
          payer_email: split.payerEmail
        });
      }
    }

    // Update order payment status and tip
    const totalPaid = parseFloat(amount) + parseFloat(tipAmount || 0);
    await pool.query(
      'UPDATE orders SET payment_status = ?, tip_amount = ? WHERE id = ?',
      ['paid', tipAmount || 0, orderId]
    );

    // Send receipt email if email provided
    if (customerEmail) {
      try {
        const [restaurantRows] = await pool.query('SELECT * FROM restaurant_info WHERE id = 1');
        const restaurant = restaurantRows[0];

        const [items] = await pool.query(`
          SELECT oi.*, mi.name as item_name
          FROM order_items oi
          JOIN menu_items mi ON oi.menu_item_id = mi.id
          WHERE oi.order_id = ?
        `, [orderId]);

        const subtotal = order.total_amount;
        const tax = (subtotal * restaurant.tax_rate) / 100;

        await emailService.sendReceipt({
          customerEmail,
          customerName: customerName || 'Valued Customer',
          orderId,
          orderItems: items.map(item => ({
            name: item.item_name,
            portion: item.portion,
            quantity: item.quantity,
            price: item.price
          })),
          subtotal,
          tax,
          tip: tipAmount || 0,
          total: totalPaid,
          paymentMethod,
          transactionId,
          restaurant,
          tableNumber: order.table_number || 'N/A',
          waiterName: 'Staff',
          date: new Date()
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the payment if email fails
      }
    }

    res.json({
      success: true,
      paymentId,
      transactionId,
      message: 'Payment processed successfully',
      receiptSent: !!customerEmail
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment history for an order
app.get('/api/payment/history/:orderId', requireAuth, async (req, res) => {
  try {
    const [payments] = await pool.query(`
      SELECT p.*, 
        u.username as processed_by_name,
        pt.payment_method_type,
        pt.last_four,
        pt.card_brand,
        pt.upi_id,
        pt.wallet_provider
      FROM payments p
      LEFT JOIN users u ON p.processed_by = u.id
      LEFT JOIN payment_tokens pt ON p.payment_token_id = pt.id
      WHERE p.order_id = ?
      ORDER BY p.created_at DESC
    `, [req.params.orderId]);

    // Get splits for each payment
    for (const payment of payments) {
      const [splits] = await pool.query(
        'SELECT * FROM payment_splits WHERE payment_id = ?',
        [payment.id]
      );
      payment.splits = splits;
    }

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Refund payment
app.post('/api/payment/refund/:paymentId', requireRole('admin'), async (req, res) => {
  const { amount, reason } = req.body;
  
  try {
    const [paymentRows] = await pool.query('SELECT * FROM payments WHERE id = ?', [req.params.paymentId]);
    const payment = paymentRows[0];
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status === 'refunded') {
      return res.status(400).json({ error: 'Payment already refunded' });
    }

    // Process refund via Stripe if applicable
    if (payment.stripe_payment_intent_id) {
      await stripe.createRefund(payment.stripe_payment_intent_id, amount || payment.amount);
    }

    // Update payment status
    await pool.query(
      'UPDATE payments SET status = ?, notes = CONCAT(COALESCE(notes, ""), "\nRefund: ", ?) WHERE id = ?',
      ['refunded', reason || 'No reason provided', req.params.paymentId]
    );

    // Update order payment status
    await pool.query(
      'UPDATE orders SET payment_status = ? WHERE id = ?',
      ['refunded', payment.order_id]
    );

    res.json({ 
      success: true, 
      message: 'Payment refunded successfully' 
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

// ===== PDF MENU PARSER ROUTES =====
const multer = require('multer');
const { parsePDFMenu, cleanMenuItems } = require('./lib/pdf-parser');

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/menus/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Upload and parse PDF menu
app.post('/api/menu/upload-pdf', authMiddleware, upload.single('menu'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await parsePDFMenu(req.file.path);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const cleanedItems = cleanMenuItems(result.items);
    
    res.json({
      fileName: result.fileName,
      totalPages: result.totalPages,
      itemsFound: cleanedItems.length,
      items: cleanedItems,
      rawText: result.rawText.substring(0, 500) + '...', // Preview only
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Import parsed menu items to database
app.post('/api/menu/import', authMiddleware, roleMiddleware(['admin', 'manager']), async (req, res) => {
  const { items } = req.body;
  
  try {
    const connection = await pool.getConnection();
    let imported = 0;
    
    for (const item of items) {
      await connection.query(
        'INSERT INTO menu_items (name, description, price, category, available) VALUES (?, ?, ?, ?, 1)',
        [item.name, item.description || '', item.price, item.category || 'Other']
      );
      imported++;
    }
    
    connection.release();
    
    res.json({
      success: true,
      imported,
      message: `${imported} menu items imported successfully`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Restaurant Management System running on http://localhost:${PORT}`);
  console.log('\nDefault Login Credentials:');
  console.log('Admin - Username: admin, Password: admin123');
  console.log('Waiter - Username: waiter1, Password: waiter123');
  console.log('Chef - Username: chef1, Password: chef123');
});
