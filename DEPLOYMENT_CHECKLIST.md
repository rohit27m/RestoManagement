# 🚀 Payment System - Deployment Checklist

Use this checklist when deploying the payment system to production.

---

## 📋 Pre-Deployment

### Database
- [ ] Run `database.sql` to create payment tables
- [ ] Verify all tables created successfully
- [ ] Check foreign key constraints
- [ ] Confirm indexes are in place
- [ ] Test database connection pooling
- [ ] Set up automated backups

### Code Review
- [ ] Review all payment API endpoints
- [ ] Check error handling in all routes
- [ ] Verify input validation
- [ ] Confirm SQL injection protection (prepared statements)
- [ ] Review session management
- [ ] Check authentication middleware

### Configuration
- [ ] Create `.env` file
- [ ] Set `NODE_ENV=production`
- [ ] Configure `STRIPE_SECRET_KEY`
- [ ] Configure `STRIPE_PUBLISHABLE_KEY`
- [ ] Set up email service API key
- [ ] Configure `EMAIL_FROM` address
- [ ] Set strong `SESSION_SECRET`
- [ ] Configure database credentials
- [ ] Set production `PORT`

---

## 🔐 Security

### SSL/HTTPS
- [ ] Obtain SSL certificate
- [ ] Configure HTTPS on server
- [ ] Update cookie settings: `secure: true`
- [ ] Test HTTPS connection
- [ ] Force HTTPS redirect

### CORS
- [ ] Update CORS origin to production domain
- [ ] Remove localhost from allowed origins
- [ ] Test cross-origin requests
- [ ] Verify credentials option

### Stripe Integration
- [ ] Replace `stripe-mock.js` with real Stripe
- [ ] Install `stripe` package: `npm install stripe`
- [ ] Update imports in `server.js`
- [ ] Test with Stripe test mode first
- [ ] Verify webhook endpoints (if using)
- [ ] Switch to live keys after testing

### Session Security
- [ ] Generate strong random session secret
- [ ] Set secure cookie options
- [ ] Configure session expiry
- [ ] Test session persistence
- [ ] Verify logout functionality

### Input Validation
- [ ] Validate all payment amounts
- [ ] Sanitize email inputs
- [ ] Validate card details (client-side)
- [ ] Check UPI ID format
- [ ] Verify tip calculations
- [ ] Test split bill edge cases

---

## 📧 Email Service

### SendGrid Setup (Recommended)
- [ ] Create SendGrid account
- [ ] Verify sender email domain
- [ ] Generate API key
- [ ] Install: `npm install @sendgrid/mail`
- [ ] Update `email-service.js`
- [ ] Test email sending
- [ ] Check spam folder
- [ ] Verify email templates render correctly

### Alternative: AWS SES
- [ ] Set up AWS account
- [ ] Verify email/domain in SES
- [ ] Create IAM user with SES permissions
- [ ] Generate access keys
- [ ] Install AWS SDK
- [ ] Update email service
- [ ] Test sending

---

## 🧪 Testing

### Unit Tests
- [ ] Test tip calculation endpoint
- [ ] Test split bill calculation
- [ ] Test payment processing
- [ ] Test tokenization
- [ ] Test refund logic
- [ ] Test payment history retrieval

### Integration Tests
- [ ] Complete payment flow (cash)
- [ ] Complete payment flow (card)
- [ ] Complete payment flow (UPI)
- [ ] Complete payment flow (wallet)
- [ ] Split bill payment
- [ ] Payment with tip
- [ ] Payment with email receipt
- [ ] Refund processing

### User Acceptance Testing
- [ ] Waiter creates order
- [ ] Waiter views bill
- [ ] Waiter processes payment (all methods)
- [ ] Admin processes refund
- [ ] Customer receives receipt email
- [ ] Receipt email displays correctly

### Load Testing
- [ ] Test concurrent payment processing
- [ ] Test database under load
- [ ] Monitor response times
- [ ] Check memory usage
- [ ] Verify connection pool efficiency

---

## 🌐 Frontend

### Next.js
- [ ] Build production bundle: `npm run build`
- [ ] Test build locally
- [ ] Update API URLs to production
- [ ] Test PaymentModal component
- [ ] Verify all payment methods work
- [ ] Check mobile responsiveness
- [ ] Test on different browsers

### Legacy UI
- [ ] Test payment modal in `waiter.html`
- [ ] Verify all JavaScript functions work
- [ ] Check CSS styling
- [ ] Test on mobile devices
- [ ] Verify print receipt functionality

---

## 📊 Monitoring

### Logging
- [ ] Set up application logging (Winston/Morgan)
- [ ] Configure error logging
- [ ] Set up payment transaction logging
- [ ] Log email sending status
- [ ] Do NOT log sensitive payment data

### Error Tracking
- [ ] Set up Sentry or similar
- [ ] Configure error notifications
- [ ] Test error reporting
- [ ] Set up alerts for payment failures

### Performance Monitoring
- [ ] Set up APM (New Relic/DataDog)
- [ ] Monitor API response times
- [ ] Track database query performance
- [ ] Set up uptime monitoring
- [ ] Configure alerting thresholds

---

## 💳 Stripe Specific

### Account Setup
- [ ] Complete Stripe account verification
- [ ] Add business details
- [ ] Configure tax settings
- [ ] Set up bank account for payouts
- [ ] Review Stripe fees

### Test Mode
- [ ] Use test API keys initially
- [ ] Test all payment scenarios
- [ ] Verify successful payments
- [ ] Test payment failures
- [ ] Test refunds
- [ ] Check dashboard updates

### Live Mode
- [ ] Switch to live API keys
- [ ] Make small test payment
- [ ] Verify payment in dashboard
- [ ] Test refund with real payment
- [ ] Monitor for first few days

### Webhooks (Optional)
- [ ] Set up webhook endpoint
- [ ] Configure webhook URL in Stripe
- [ ] Add webhook signature verification
- [ ] Test webhook events
- [ ] Handle failed webhook deliveries

---

## 🗄️ Database

### Production Database
- [ ] Create production database
- [ ] Run migration scripts
- [ ] Set up read replicas (optional)
- [ ] Configure automated backups
- [ ] Set up backup restore testing
- [ ] Monitor database size

### Performance
- [ ] Add indexes to frequently queried columns
- [ ] Optimize slow queries
- [ ] Set up query performance monitoring
- [ ] Configure connection pool size
- [ ] Test under expected load

---

## 🔄 Deployment

### Server Setup
- [ ] Provision production server
- [ ] Install Node.js (v18+)
- [ ] Install MySQL (8.0+)
- [ ] Install process manager (PM2)
- [ ] Configure firewall
- [ ] Set up reverse proxy (Nginx)

### Application Deployment
- [ ] Clone repository
- [ ] Install dependencies: `npm install`
- [ ] Set up environment variables
- [ ] Build frontend (if Next.js)
- [ ] Run database migrations
- [ ] Start application: `pm2 start server.js`
- [ ] Configure auto-restart
- [ ] Set up deployment script

### DNS & Domain
- [ ] Configure domain DNS
- [ ] Point to server IP
- [ ] Set up www redirect
- [ ] Verify SSL certificate
- [ ] Test domain access

---

## ✅ Post-Deployment

### Verification
- [ ] Access application via production URL
- [ ] Test user login
- [ ] Create test order
- [ ] Process test payment (small amount)
- [ ] Verify payment in Stripe dashboard
- [ ] Check database entry
- [ ] Verify email receipt sent
- [ ] Test refund process
- [ ] Check all payment methods

### Monitoring (First 24 Hours)
- [ ] Monitor error logs
- [ ] Check payment success rate
- [ ] Monitor server resources
- [ ] Track response times
- [ ] Review email delivery rate
- [ ] Check for any security issues

### Documentation
- [ ] Update production URLs in docs
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document rollback procedure
- [ ] Share credentials securely with team

### Training
- [ ] Train staff on new payment system
- [ ] Provide payment processing guide
- [ ] Demonstrate split bill feature
- [ ] Show tip calculation
- [ ] Explain digital receipts
- [ ] Practice refund process

---

## 🐛 Common Issues & Solutions

### Payment Fails
- Check Stripe API key is correct
- Verify network connectivity to Stripe
- Review Stripe dashboard for errors
- Check payment amount is valid (> 0)

### Receipt Not Sent
- Verify email service API key
- Check email address format
- Review email service quota/limits
- Check spam folder

### Database Connection Error
- Verify database credentials
- Check database server is running
- Verify connection pool configuration
- Check firewall rules

### CORS Error
- Update CORS configuration
- Add production domain to allowed origins
- Verify credentials option set
- Check browser console for details

---

## 📞 Emergency Contacts

Document key contacts:
- [ ] Database administrator
- [ ] Server/DevOps team
- [ ] Stripe support
- [ ] Email service support
- [ ] On-call developer

---

## 🎉 Launch

When everything is checked:

```bash
# Final checks
npm test                    # Run all tests
npm run build              # Build production
pm2 start server.js        # Start server
pm2 logs                   # Monitor logs
```

### Go Live! 🚀

- [ ] Announce to team
- [ ] Monitor closely for first day
- [ ] Be ready to roll back if needed
- [ ] Collect user feedback
- [ ] Celebrate success! 🎊

---

**Last Updated**: February 14, 2026
**Version**: 2.0.0
**Status**: Ready for Production Deployment
