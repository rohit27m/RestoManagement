# 🚀 Payment System Setup Guide

## Quick Start

### 1. Update Database Schema

Run the updated database schema to add payment tables:

```bash
# Connect to MySQL
mysql -u root -p

# Run the schema
source d:/Project1/database.sql
```

Or manually execute the SQL file in your MySQL client.

### 2. Install Dependencies (Already Included)

The payment system uses existing dependencies:
- `mysql2` - Database operations
- `express` - API routes
- `bcrypt` - Password hashing (for future customer accounts)

No additional packages required!

### 3. Start the Server

```bash
# From project root
npm start

# Or with auto-reload
npm run dev
```

### 4. Start Next.js Frontend (Optional)

```bash
cd client
npm run dev
```

Access the application:
- **Backend API**: http://localhost:4000
- **Legacy UI**: http://localhost:4000
- **Next.js UI**: http://localhost:3000

---

## 🗄️ Database Migration

### New Tables Created
1. **payment_tokens** - Stores tokenized payment methods
2. **payments** - Records all payment transactions
3. **payment_splits** - Tracks split bill payments

### Modified Tables
1. **orders** - Added `payment_status` and `tip_amount` columns

### Migration Steps

If you have existing data:

```sql
-- Add new columns to orders table
ALTER TABLE orders 
ADD COLUMN payment_status ENUM('unpaid', 'partially_paid', 'paid', 'refunded') DEFAULT 'unpaid',
ADD COLUMN tip_amount DECIMAL(10,2) DEFAULT 0;

-- Create payment_tokens table
CREATE TABLE payment_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  payment_method_type ENUM('card', 'upi', 'wallet') NOT NULL,
  token VARCHAR(255) NOT NULL,
  last_four VARCHAR(4),
  card_brand VARCHAR(50),
  upi_id VARCHAR(255),
  wallet_provider VARCHAR(50),
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_token (token)
);

-- Create payments table
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  payment_method ENUM('cash', 'card', 'upi', 'wallet') NOT NULL,
  payment_token_id INT NULL,
  amount DECIMAL(10,2) NOT NULL,
  tip_amount DECIMAL(10,2) DEFAULT 0,
  status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  transaction_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  payment_gateway_response TEXT,
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  notes TEXT,
  processed_by INT,
  processed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (payment_token_id) REFERENCES payment_tokens(id),
  FOREIGN KEY (processed_by) REFERENCES users(id),
  INDEX idx_order (order_id),
  INDEX idx_transaction (transaction_id)
);

-- Create payment_splits table
CREATE TABLE payment_splits (
  id INT PRIMARY KEY AUTO_INCREMENT,
  payment_id INT NOT NULL,
  split_amount DECIMAL(10,2) NOT NULL,
  split_percentage DECIMAL(5,2),
  payer_name VARCHAR(255),
  payer_email VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
);
```

---

## 🔧 Configuration

### Stripe Configuration (Production)

1. Get Stripe API keys from https://stripe.com

2. Create a `.env` file in the project root:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here

# Email Service (Optional)
SENDGRID_API_KEY=your_sendgrid_key_here
EMAIL_FROM=noreply@yourrestaurant.com
RESTAURANT_NAME=Your Restaurant Name

# Environment
NODE_ENV=production
```

3. Update `stripe-mock.js` to use real Stripe:

```javascript
// For production, replace with:
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
module.exports = stripe;
```

### Email Service Configuration (Production)

#### Option 1: SendGrid

```bash
npm install @sendgrid/mail
```

Update `email-service.js`:
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// In sendProductionEmail method:
const msg = {
  to: emailData.to,
  from: this.fromEmail,
  subject: emailData.subject,
  text: emailData.text,
  html: emailData.html,
};

await sgMail.send(msg);
```

#### Option 2: AWS SES

```bash
npm install @aws-sdk/client-ses
```

#### Option 3: Nodemailer (SMTP)

```bash
npm install nodemailer
```

---

## 🧪 Testing

### Test the Payment System

#### 1. Test Cash Payment

```javascript
// In browser console or Postman
fetch('http://localhost:4000/api/payment/process', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    orderId: 1,
    paymentMethod: 'cash',
    amount: 1050.00,
    tipAmount: 50.00,
    customerEmail: 'test@example.com',
    customerName: 'Test Customer'
  })
})
.then(r => r.json())
.then(console.log);
```

#### 2. Test Card Payment (Mock)

```javascript
fetch('http://localhost:4000/api/payment/process', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    orderId: 1,
    paymentMethod: 'card',
    amount: 1050.00,
    tipAmount: 50.00,
    customerEmail: 'test@example.com'
  })
})
.then(r => r.json())
.then(console.log);
```

#### 3. Test Split Bill

```javascript
// Calculate split
fetch('http://localhost:4000/api/payment/calculate-split', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    orderId: 1,
    numberOfSplits: 3
  })
})
.then(r => r.json())
.then(console.log);
```

#### 4. Test Tip Calculation

```javascript
fetch('http://localhost:4000/api/payment/calculate-tip', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    orderId: 1,
    tipPercentage: 15
  })
})
.then(r => r.json())
.then(console.log);
```

#### 5. Check Email Receipts

Development mode saves receipts to:
```
d:\Project1\mock-emails\receipt_[timestamp].html
```

Open these HTML files in a browser to preview receipts.

---

## 🎨 UI Testing

### Next.js Frontend
1. Login at http://localhost:3000
2. Navigate to Tables tab
3. Create an order
4. Click "View Bill" on occupied table
5. Click "Process Payment"
6. Test payment modal features:
   - Tip calculation
   - Split bill
   - Different payment methods
   - Customer details

### Legacy Frontend
1. Login at http://localhost:4000
2. Same workflow as Next.js
3. Test payment modal
4. Check console for email logs

---

## 📊 Verify Installation

### Check Database Tables

```sql
USE restaurant_management;

-- Verify new tables exist
SHOW TABLES;

-- Check table structure
DESCRIBE payments;
DESCRIBE payment_tokens;
DESCRIBE payment_splits;

-- Verify orders table updates
DESCRIBE orders;
```

### Check API Endpoints

```bash
# Test server is running
curl http://localhost:4000/api/restaurant

# Check payment routes are loaded (after login)
# You should see payment endpoints in server logs
```

---

## 🔍 Troubleshooting

### Issue: Database Schema Not Updated

**Solution:**
```sql
-- Drop and recreate database
DROP DATABASE restaurant_management;
CREATE DATABASE restaurant_management;

-- Re-run schema
source d:/Project1/database.sql
```

### Issue: Payment Modal Not Showing

**Solution:**
- Clear browser cache
- Check browser console for errors
- Verify `PaymentModal.tsx` exists in `client/app/components/`
- Verify `waiter.html` includes payment modal HTML

### Issue: Stripe Errors in Production

**Solution:**
- Verify `STRIPE_SECRET_KEY` in environment variables
- Check Stripe dashboard for API status
- Ensure using live keys (not test keys)
- Check Stripe webhook configuration

### Issue: Emails Not Sending

**Solution:**
- In development: Check `mock-emails/` directory
- In production: Verify email service API key
- Check `NODE_ENV` environment variable
- Review server logs for email errors

### Issue: Split Bill Calculation Wrong

**Solution:**
- Ensure tip is included in order before splitting
- Check for rounding issues (JavaScript floating point)
- Verify bill total calculation includes tax

---

## 🔐 Security Checklist

Before going to production:

- [ ] Replace mock Stripe with real Stripe SDK
- [ ] Set strong session secret in `server.js`
- [ ] Enable HTTPS/SSL
- [ ] Set `secure: true` for cookies
- [ ] Configure CORS for production domain
- [ ] Set up rate limiting
- [ ] Enable SQL injection protection (prepared statements ✅)
- [ ] Implement input validation
- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Regular security audits
- [ ] PCI DSS compliance review
- [ ] Data backup strategy

---

## 📈 Performance Optimization

- [ ] Add database indexes (already included)
- [ ] Implement caching (Redis)
- [ ] Optimize large queries
- [ ] Add request rate limiting
- [ ] Enable gzip compression
- [ ] CDN for static assets
- [ ] Database connection pooling (already implemented)

---

## 🚦 Deployment Checklist

### Production Environment
- [ ] Set `NODE_ENV=production`
- [ ] Use real Stripe keys
- [ ] Configure email service
- [ ] Set up SSL certificate
- [ ] Configure domain DNS
- [ ] Set up monitoring (UptimeRobot, Pingdom)
- [ ] Configure automated backups
- [ ] Set up error tracking
- [ ] Load testing
- [ ] Security scan

### Environment Variables
```bash
NODE_ENV=production
PORT=4000
STRIPE_SECRET_KEY=sk_live_...
SENDGRID_API_KEY=SG...
EMAIL_FROM=noreply@restaurant.com
SESSION_SECRET=your_strong_random_secret
DATABASE_HOST=your_db_host
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=restaurant_management
```

---

## 📚 Additional Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [PCI Compliance Guide](https://stripe.com/docs/security)
- [SendGrid API Docs](https://docs.sendgrid.com/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

## ✅ Verification

After setup, verify everything works:

```bash
# 1. Database tables created
mysql -u root -p -e "USE restaurant_management; SHOW TABLES;"

# 2. Server starts without errors
npm start

# 3. Payment endpoints respond
curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"waiter1","password":"waiter123"}'

# 4. Frontend loads
open http://localhost:4000
```

---

**Setup Complete! 🎉**

Your restaurant management system now has a fully functional payment processing system with multiple payment methods, split billing, tips, and digital receipts.

For issues or questions, check the troubleshooting section or review the PAYMENT_SYSTEM.md documentation.
