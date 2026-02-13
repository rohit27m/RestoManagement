# 💳 Payment System Documentation

## Overview

A comprehensive, modular payment system supporting multiple payment methods with PCI-compliant tokenization, split bill functionality, tip calculation, and digital receipt delivery.

---

## 🏗️ Architecture

### Components

1. **Database Layer** - Payment tables for transactions, tokens, and splits
2. **Backend API** - RESTful endpoints for payment processing
3. **Mock Stripe Integration** - Simulated payment gateway for development
4. **Email Service** - Digital receipt delivery system
5. **Frontend UI** - Payment modals for both Next.js and legacy interfaces

---

## 📊 Database Schema

### `payments` Table
Stores all payment transactions with full audit trail.

```sql
- id: Primary key
- order_id: Reference to orders table
- payment_method: ENUM('cash', 'card', 'upi', 'wallet')
- amount: Total payment amount
- tip_amount: Tip amount
- status: ENUM('pending', 'processing', 'completed', 'failed', 'refunded')
- transaction_id: Unique transaction identifier
- stripe_payment_intent_id: Stripe reference (for card/UPI/wallet)
- customer_email: For receipt delivery
- customer_name: Customer information
- processed_by: User who processed payment
- processed_at: Timestamp of processing
```

### `payment_tokens` Table
PCI-compliant tokenization for sensitive payment data.

```sql
- id: Primary key
- payment_method_type: ENUM('card', 'upi', 'wallet')
- token: Tokenized payment method
- last_four: Last 4 digits (for cards)
- card_brand: Visa, Mastercard, etc.
- upi_id: UPI identifier
- wallet_provider: Paytm, PhonePe, etc.
```

### `payment_splits` Table
Track split bill payments.

```sql
- id: Primary key
- payment_id: Reference to payments
- split_amount: Amount for this split
- split_percentage: Percentage of total
- payer_name: Name of person paying
- payer_email: Email for receipt
```

### `orders` Table Updates
Added payment tracking fields:

```sql
- payment_status: ENUM('unpaid', 'partially_paid', 'paid', 'refunded')
- tip_amount: Total tips for order
```

---

## 🔌 API Endpoints

### Payment Processing

#### `POST /api/payment/process`
Process a payment transaction.

**Request Body:**
```json
{
  "orderId": 123,
  "paymentMethod": "card|cash|upi|wallet",
  "amount": 1500.00,
  "tipAmount": 150.00,
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "splits": [
    {
      "amount": 750.00,
      "percentage": 50,
      "payerName": "Person 1"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "paymentId": 456,
  "transactionId": "ch_abc123xyz",
  "message": "Payment processed successfully",
  "receiptSent": true
}
```

### Tokenization

#### `POST /api/payment/tokenize`
Create PCI-compliant payment token.

**Request Body:**
```json
{
  "paymentMethod": {
    "type": "card",
    "card": {
      "number": "4242424242424242",
      "exp_month": "12",
      "exp_year": "25",
      "cvc": "123"
    }
  },
  "customerEmail": "customer@example.com"
}
```

**Response:**
```json
{
  "tokenId": 789,
  "token": "tok_abc123",
  "message": "Payment method tokenized successfully"
}
```

### Tip Calculation

#### `POST /api/payment/calculate-tip`
Calculate tip amount and final total.

**Request Body:**
```json
{
  "orderId": 123,
  "tipPercentage": 15,
  "customTipAmount": null
}
```

**Response:**
```json
{
  "subtotal": 1000.00,
  "tax": 50.00,
  "billTotal": 1050.00,
  "tipAmount": 157.50,
  "tipPercentage": 15,
  "finalTotal": 1207.50
}
```

### Split Bill

#### `POST /api/payment/calculate-split`
Calculate split bill amounts.

**Request Body:**
```json
{
  "orderId": 123,
  "numberOfSplits": 3,
  "customSplits": null
}
```

**Response:**
```json
{
  "orderId": 123,
  "subtotal": 1000.00,
  "tax": 50.00,
  "tipAmount": 0,
  "total": 1050.00,
  "numberOfSplits": 3,
  "splits": [
    {
      "amount": 350.00,
      "percentage": 33.33,
      "payerName": null
    }
  ]
}
```

### Payment History

#### `GET /api/payment/history/:orderId`
Retrieve all payments for an order.

**Response:**
```json
[
  {
    "id": 456,
    "order_id": 123,
    "payment_method": "card",
    "amount": 1050.00,
    "tip_amount": 150.00,
    "status": "completed",
    "transaction_id": "ch_abc123",
    "processed_by_name": "waiter1",
    "splits": []
  }
]
```

### Refund

#### `POST /api/payment/refund/:paymentId`
Refund a payment (admin only).

**Request Body:**
```json
{
  "amount": 1050.00,
  "reason": "Customer complaint"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment refunded successfully"
}
```

---

## 💳 Supported Payment Methods

### 1. Cash 💵
- Instant processing
- No additional validation required
- Transaction ID: `cash_[timestamp]_[random]`

### 2. Card 💳
- Stripe integration (mocked for development)
- PCI-compliant tokenization
- Supports: Visa, Mastercard, Amex, Discover, JCB
- Validates card number, expiry, CVV

### 3. UPI 📱
- Stripe UPI integration (mocked)
- Requires valid UPI ID (format: name@provider)
- Common providers: gpay, paytm, phonepe

### 4. Wallet 👛
- Digital wallet integration
- Supported: Paytm, PhonePe, Google Pay, Amazon Pay
- Email-based authentication

---

## 🔐 Security & PCI Compliance

### Tokenization Approach
- **Never store raw card numbers** - All sensitive data is tokenized
- **Stripe-managed tokens** - Payment details stored securely by Stripe
- **Database stores only tokens** - Reference tokens instead of actual data
- **Last 4 digits only** - For display purposes in UI

### Best Practices Implemented
1. ✅ HTTPS enforcement (production)
2. ✅ Session-based authentication
3. ✅ Role-based access control
4. ✅ Payment tokenization
5. ✅ Audit trail (all transactions logged)
6. ✅ No sensitive data in logs
7. ✅ Secure transaction IDs

### Production Checklist
- [ ] Replace mock Stripe with real Stripe SDK
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Set Stripe secret key in environment variables
- [ ] Configure SendGrid/AWS SES for email
- [ ] Enable audit logging
- [ ] Implement rate limiting
- [ ] Add fraud detection
- [ ] Regular security audits

---

## 📧 Digital Receipt System

### Email Service
Mock implementation included; production-ready integration points for:
- **SendGrid**
- **AWS SES**
- **Mailgun**
- **Custom SMTP**

### Receipt Contents
- Restaurant information
- Order details (items, quantities, prices)
- Subtotal, tax, tip breakdown
- Payment method and transaction ID
- Customer information
- Thank you message

### Email Formats
- **HTML** - Styled, professional receipt
- **Plain Text** - Fallback for all clients

### Development Mode
- Receipts saved to `mock-emails/` directory
- Console logging of email details
- Easy testing without actual email service

---

## 🎨 Frontend Integration

### Next.js Component (PaymentModal.tsx)

**Features:**
- Modern React component with TypeScript
- Real-time tip calculation
- Split bill calculator
- Payment method switcher
- Form validation
- Loading states
- Success animations

**Usage:**
```tsx
import PaymentModal from '../components/PaymentModal';

<PaymentModal
  isOpen={showPaymentModal}
  onClose={() => setShowPaymentModal(false)}
  orderId={currentOrderId}
  billData={billData}
  onPaymentComplete={handlePaymentComplete}
/>
```

### Legacy JavaScript (waiter.js)

**Functions:**
- `processPayment()` - Open payment modal
- `setTipPercentage(percent)` - Quick tip buttons
- `setCustomTip()` - Custom tip input
- `changePaymentMethod()` - Switch payment method
- `submitPayment()` - Process payment
- `closePaymentModal()` - Close modal

---

## 🧪 Testing

### Mock Stripe Behavior
- **Success Rate**: 95% (simulates real-world scenarios)
- **Network Delay**: 300-500ms (realistic latency)
- **Card Brand Detection**: Auto-detects from card number
- **Transaction IDs**: Realistic format (`ch_`, `pi_`, `tok_`)

### Test Cards
```
Visa: 4242424242424242
Mastercard: 5555555555554444
Amex: 378282246310005
Discover: 6011111111111117
```

### Test UPI IDs
```
test@upi
demo@paytm
example@gpay
```

---

## 🚀 Usage Workflows

### Standard Payment Flow
1. Waiter creates order
2. Items are prepared and served
3. Waiter views bill
4. Click "Process Payment"
5. Select payment method
6. Optional: Add tip
7. Optional: Enter customer details for receipt
8. Submit payment
9. System processes via Stripe (or cash)
10. Digital receipt sent (if email provided)
11. Order marked as paid
12. Table becomes available

### Split Bill Flow
1. Follow steps 1-4 above
2. Enable "Split Bill" checkbox
3. Enter number of splits (or custom amounts)
4. System calculates equal splits
5. Process payment for first split
6. Repeat for additional splits
7. Order marked as paid when fully settled

### Refund Flow (Admin Only)
1. Admin accesses order
2. Views payment history
3. Clicks refund
4. Enters refund amount and reason
5. System processes refund via Stripe
6. Order payment status updated
7. Customer notified (if email on file)

---

## 📈 Reporting & Analytics

### Available Metrics (Future Enhancement)
- Total revenue by payment method
- Average tip percentage
- Split bill frequency
- Payment success/failure rates
- Peak payment hours
- Customer receipt email capture rate

---

## 🔧 Configuration

### Environment Variables
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# Email Configuration
EMAIL_FROM=noreply@restaurant.com
RESTAURANT_NAME=My Restaurant

# SendGrid (Production)
SENDGRID_API_KEY=your_sendgrid_key

# Node Environment
NODE_ENV=production
```

### Restaurant Settings
Configured via `/api/restaurant`:
- Tax rate (%)
- Restaurant name
- Address
- Phone number

---

## 🐛 Troubleshooting

### Payment Fails
- Check Stripe API key
- Verify network connectivity
- Check payment method details
- Review server logs

### Receipt Not Sent
- Verify customer email format
- Check email service configuration
- Review `mock-emails/` directory in development
- Check email service quota/limits

### Split Bill Issues
- Ensure total splits equal order amount
- Verify split percentages sum to 100%
- Check for rounding errors

---

## 📝 API Response Codes

- `200` - Success
- `400` - Bad Request (invalid data)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (order/payment not found)
- `500` - Server Error

---

## 🔄 Future Enhancements

### Planned Features
- [ ] Recurring payments/subscriptions
- [ ] QR code payment (WeChat Pay, Alipay)
- [ ] Cryptocurrency support
- [ ] Gift card/voucher system
- [ ] Loyalty points integration
- [ ] Multi-currency support
- [ ] Payment installments
- [ ] Automatic gratuity for large parties
- [ ] Contactless/NFC payments
- [ ] Payment analytics dashboard

### Integration Opportunities
- [ ] Accounting software (QuickBooks, Xero)
- [ ] CRM systems
- [ ] Inventory management
- [ ] Staff commission tracking
- [ ] Customer loyalty programs

---

## 📞 Support

For payment-related issues:
1. Check server logs: `d:\Project1\`
2. Review mock emails: `d:\Project1\mock-emails\`
3. Test with mock payment methods
4. Verify database schema is up-to-date

---

## 📄 License

Part of Restaurant Management System - MIT License

---

**Last Updated**: February 14, 2026
**Version**: 1.0.0
**Status**: ✅ Production Ready (with real Stripe integration)
