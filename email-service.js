/**
 * Email Service for Digital Receipts
 * Mock implementation for development
 * In production, integrate with SendGrid, AWS SES, or similar
 */

const fs = require('fs');
const path = require('path');

class EmailService {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@restaurant.com';
    this.fromName = process.env.RESTAURANT_NAME || 'My Restaurant';
  }

  /**
   * Send receipt email
   */
  async sendReceipt(receiptData) {
    const { 
      customerEmail, 
      customerName,
      orderId, 
      orderItems, 
      subtotal, 
      tax, 
      tip, 
      total,
      paymentMethod,
      transactionId,
      restaurant,
      date 
    } = receiptData;

    const emailHtml = this.generateReceiptHtml(receiptData);
    const emailText = this.generateReceiptText(receiptData);

    if (this.isProduction) {
      // In production, use actual email service
      return await this.sendProductionEmail({
        to: customerEmail,
        subject: `Receipt for Order #${orderId} - ${restaurant.name}`,
        html: emailHtml,
        text: emailText
      });
    } else {
      // In development, save to file and log
      return await this.mockSendEmail({
        to: customerEmail,
        subject: `Receipt for Order #${orderId} - ${restaurant.name}`,
        html: emailHtml,
        text: emailText
      });
    }
  }

  /**
   * Generate HTML receipt
   */
  generateReceiptHtml(data) {
    const { 
      customerName, 
      orderId, 
      orderItems, 
      subtotal, 
      tax, 
      tip, 
      total,
      paymentMethod,
      transactionId,
      restaurant,
      tableNumber,
      waiterName,
      date 
    } = data;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt #${orderId}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 5px 0; color: #666; }
    .order-info { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    .order-info p { margin: 5px 0; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .items-table th { background: #333; color: white; padding: 10px; text-align: left; }
    .items-table td { padding: 10px; border-bottom: 1px solid #ddd; }
    .totals { margin-left: auto; width: 250px; }
    .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .totals-row.total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; margin-top: 10px; padding-top: 10px; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
    .payment-info { background: #e8f5e9; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🍽️ ${restaurant.name}</h1>
    <p>${restaurant.address}</p>
    <p>Phone: ${restaurant.phone}</p>
  </div>

  <div class="order-info">
    <p><strong>Receipt #:</strong> ${orderId}</p>
    <p><strong>Date:</strong> ${new Date(date).toLocaleString()}</p>
    <p><strong>Table:</strong> ${tableNumber}</p>
    <p><strong>Server:</strong> ${waiterName}</p>
    ${customerName ? `<p><strong>Customer:</strong> ${customerName}</p>` : ''}
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th>Item</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${orderItems.map(item => `
        <tr>
          <td>${item.name} ${item.portion !== 'full' ? `(${item.portion})` : ''}</td>
          <td>${item.quantity}</td>
          <td>₹${item.price.toFixed(2)}</td>
          <td>₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <span>Subtotal:</span>
      <span>₹${subtotal.toFixed(2)}</span>
    </div>
    <div class="totals-row">
      <span>Tax (${restaurant.tax_rate}%):</span>
      <span>₹${tax.toFixed(2)}</span>
    </div>
    ${tip > 0 ? `
    <div class="totals-row">
      <span>Tip:</span>
      <span>₹${tip.toFixed(2)}</span>
    </div>
    ` : ''}
    <div class="totals-row total">
      <span>Total:</span>
      <span>₹${total.toFixed(2)}</span>
    </div>
  </div>

  <div class="payment-info">
    <p><strong>✅ Payment Successful</strong></p>
    <p><strong>Payment Method:</strong> ${paymentMethod.toUpperCase()}</p>
    <p><strong>Transaction ID:</strong> ${transactionId}</p>
  </div>

  <div class="footer">
    <p>Thank you for dining with us!</p>
    <p>We look forward to serving you again.</p>
    <p style="margin-top: 15px; font-size: 12px;">
      This is a digital receipt. Please save for your records.
    </p>
  </div>
</body>
</html>
    `;
  }

  /**
   * Generate plain text receipt
   */
  generateReceiptText(data) {
    const { 
      orderId, 
      orderItems, 
      subtotal, 
      tax, 
      tip, 
      total,
      paymentMethod,
      transactionId,
      restaurant,
      tableNumber,
      waiterName,
      date 
    } = data;

    return `
${restaurant.name}
${restaurant.address}
Phone: ${restaurant.phone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Receipt #${orderId}
Date: ${new Date(date).toLocaleString()}
Table: ${tableNumber}
Server: ${waiterName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ORDER ITEMS:

${orderItems.map(item => 
  `${item.name} ${item.portion !== 'full' ? `(${item.portion})` : ''}\n  ${item.quantity} x ₹${item.price.toFixed(2)} = ₹${(item.price * item.quantity).toFixed(2)}`
).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Subtotal:        ₹${subtotal.toFixed(2)}
Tax (${restaurant.tax_rate}%):       ₹${tax.toFixed(2)}
${tip > 0 ? `Tip:             ₹${tip.toFixed(2)}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:           ₹${total.toFixed(2)}

Payment Method: ${paymentMethod.toUpperCase()}
Transaction ID: ${transactionId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for dining with us!

This is a digital receipt.
Please save for your records.
    `.trim();
  }

  /**
   * Mock email sending for development
   */
  async mockSendEmail(emailData) {
    console.log('\n📧 ========= EMAIL SENT (MOCK) =========');
    console.log(`To: ${emailData.to}`);
    console.log(`Subject: ${emailData.subject}`);
    console.log('=======================================\n');

    // Save email to file for testing
    const emailsDir = path.join(__dirname, 'mock-emails');
    if (!fs.existsSync(emailsDir)) {
      fs.mkdirSync(emailsDir);
    }

    const timestamp = Date.now();
    const filename = `receipt_${timestamp}.html`;
    const filepath = path.join(emailsDir, filename);

    fs.writeFileSync(filepath, emailData.html);
    console.log(`📄 Receipt saved to: ${filepath}\n`);

    return {
      success: true,
      messageId: `mock_${timestamp}`,
      message: 'Email sent successfully (mock)',
      filepath
    };
  }

  /**
   * Production email sending (placeholder)
   */
  async sendProductionEmail(emailData) {
    // Example integration with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: emailData.to,
      from: this.fromEmail,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
    };
    
    const result = await sgMail.send(msg);
    return { success: true, messageId: result[0].headers['x-message-id'] };
    */

    // For now, fallback to mock
    return this.mockSendEmail(emailData);
  }
}

module.exports = new EmailService();
