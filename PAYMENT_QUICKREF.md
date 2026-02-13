# 💳 Payment System - Quick Reference

## 🚀 Quick Start

### Process a Payment
1. View bill for an order
2. Click "Process Payment"
3. Select payment method
4. Add tip (optional)
5. Enter customer details (optional)
6. Submit payment

---

## 💰 Payment Methods

| Method | Icon | Validation Required |
|--------|------|---------------------|
| Cash | 💵 | None |
| Card | 💳 | Card number, Expiry, CVV |
| UPI | 📱 | UPI ID (name@provider) |
| Wallet | 👛 | Wallet provider selection |

---

## 🧮 Tip Calculation

**Quick Buttons**: 0%, 5%, 10%, 15%, 20%
**Custom Amount**: Enter any amount

**Formula**: 
```
Tip = (Subtotal + Tax) × Tip%
Final Total = Subtotal + Tax + Tip
```

---

## 🔪 Split Bill

### Equal Split
1. Enable "Split Bill"
2. Enter number of people
3. System divides equally

### Custom Split
1. Enable "Split Bill"
2. Enter custom amounts
3. Ensure total matches bill

**Formula**:
```
Per Person = Total ÷ Number of Splits
```

---

## 🧾 Digital Receipts

**Automatic**: Enter customer email
**Contains**:
- Order items & prices
- Tax & tip breakdown
- Payment method
- Transaction ID
- Restaurant info

**Delivery**: Instant via email
**Format**: HTML + Plain text

---

## 🔐 Security

✅ **PCI Compliant**: Tokenized payment data
✅ **No Card Storage**: Cards never stored in database
✅ **Encrypted**: All sensitive data encrypted
✅ **Audit Trail**: All transactions logged

---

## 📊 Transaction IDs

| Method | Format | Example |
|--------|--------|---------|
| Cash | cash_[timestamp]_[random] | cash_1707897600_abc123 |
| Card | ch_[stripe_id] | ch_abc123xyz |
| UPI | pi_[payment_intent] | pi_def456uvw |
| Wallet | ch_[stripe_id] | ch_ghi789rst |

---

## 🔄 Payment Status

```
Order Status → Payment Status
├── pending → unpaid
├── preparing → unpaid
├── ready → unpaid
├── served → unpaid
└── completed → paid ✓
```

**Refund Status**: paid → refunded (admin only)

---

## 🎯 Success Rate

**Mock Stripe**: 95% success rate
**Real Stripe**: Varies by card/bank

---

## 📱 API Endpoints

```bash
POST   /api/payment/process          # Process payment
POST   /api/payment/calculate-tip    # Calculate tip
POST   /api/payment/calculate-split  # Split bill
POST   /api/payment/tokenize         # Tokenize card
GET    /api/payment/history/:id      # Payment history
POST   /api/payment/refund/:id       # Refund (admin)
```

---

## 🐛 Common Issues

### Payment Fails
- ❌ Invalid card details
- ❌ Insufficient funds (5% mock failure)
- ❌ Invalid UPI ID format
- ✅ Retry with different method

### Receipt Not Sent
- ❌ No email provided
- ❌ Invalid email format
- ✅ Check `mock-emails/` folder (dev mode)

### Split Doesn't Match
- ❌ Splits don't equal total
- ❌ Rounding errors
- ✅ Use equal split or verify custom amounts

---

## 🎨 UI Components

### Next.js
- `PaymentModal.tsx` - Full payment interface
- Props: `orderId`, `billData`, `onPaymentComplete`

### Legacy
- `waiter.html` - Payment modal HTML
- `waiter.js` - Payment logic
- `processPayment()` - Main function

---

## 📈 Reports (Future)

- Total revenue by payment method
- Average tip percentage
- Peak payment hours
- Payment success rate
- Customer email capture rate

---

## ⚙️ Configuration

### Environment Variables
```env
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG...
EMAIL_FROM=noreply@restaurant.com
NODE_ENV=production
```

### Restaurant Settings
- Tax Rate: Configurable %
- Restaurant Name, Address, Phone

---

## 📞 Support

**Logs**: Check server console
**Emails**: Check `mock-emails/` directory
**Database**: Review `payments` table
**API**: Test with Postman/curl

---

## ✅ Pre-Flight Checklist

Before processing payments:
- [ ] Database schema updated
- [ ] Server running (Port 4000)
- [ ] User logged in
- [ ] Order exists
- [ ] Bill calculated
- [ ] Payment method validated

---

## 🎓 Best Practices

1. **Always ask for tip** - Increases revenue
2. **Capture email** - Build customer database
3. **Process payment last** - After customer satisfaction
4. **Split carefully** - Verify amounts match
5. **Print receipt** - Physical backup option
6. **Check status** - Confirm payment before closing table

---

## 💡 Pro Tips

- Use quick tip buttons for speed
- Cash is fastest (no validation)
- UPI popular in India
- Cards need full details
- Email = Future marketing opportunity
- Transaction ID = Reference for disputes

---

**Version**: 2.0.0
**Last Updated**: February 14, 2026

For detailed documentation, see `PAYMENT_SYSTEM.md`
