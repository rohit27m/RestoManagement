/**
 * Mock Stripe Payment Gateway Integration
 * Simulates Stripe API for development/testing
 * In production, replace with actual Stripe SDK
 */

class StripeMock {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.isTestMode = apiKey.startsWith('sk_test_');
  }

  /**
   * Create a payment intent (simulated)
   */
  async createPaymentIntent({ amount, currency = 'inr', metadata = {} }) {
    // Simulate network delay
    await this.simulateDelay(300);

    const paymentIntentId = `pi_${this.generateId()}`;
    
    return {
      id: paymentIntentId,
      amount: Math.round(amount * 100), // Stripe uses smallest currency unit
      currency,
      status: 'requires_payment_method',
      client_secret: `${paymentIntentId}_secret_${this.generateId()}`,
      metadata,
      created: Date.now() / 1000
    };
  }

  /**
   * Confirm a payment (simulated)
   */
  async confirmPayment(paymentIntentId, paymentMethod) {
    await this.simulateDelay(500);

    // Simulate random payment success/failure (95% success rate)
    const isSuccess = Math.random() > 0.05;

    if (!isSuccess) {
      throw new Error('Payment failed: Insufficient funds or card declined');
    }

    return {
      id: paymentIntentId,
      status: 'succeeded',
      amount_received: paymentMethod.amount,
      payment_method: {
        type: paymentMethod.type,
        card: paymentMethod.card,
        upi: paymentMethod.upi,
        wallet: paymentMethod.wallet
      },
      charges: {
        data: [{
          id: `ch_${this.generateId()}`,
          status: 'succeeded',
          receipt_url: `https://stripe.com/receipts/mock_${this.generateId()}`
        }]
      }
    };
  }

  /**
   * Create a payment token (for PCI compliance)
   */
  async createToken(paymentDetails) {
    await this.simulateDelay(200);

    const tokenId = `tok_${this.generateId()}`;
    
    let tokenData = {
      id: tokenId,
      type: paymentDetails.type,
      created: Date.now() / 1000
    };

    if (paymentDetails.type === 'card') {
      tokenData.card = {
        last4: paymentDetails.card.number.slice(-4),
        brand: this.detectCardBrand(paymentDetails.card.number),
        exp_month: paymentDetails.card.exp_month,
        exp_year: paymentDetails.card.exp_year,
        fingerprint: this.generateId()
      };
    } else if (paymentDetails.type === 'upi') {
      tokenData.upi = {
        vpa: paymentDetails.upi.vpa
      };
    } else if (paymentDetails.type === 'wallet') {
      tokenData.wallet = {
        provider: paymentDetails.wallet.provider,
        email: paymentDetails.wallet.email
      };
    }

    return tokenData;
  }

  /**
   * Process refund (simulated)
   */
  async createRefund(paymentIntentId, amount) {
    await this.simulateDelay(400);

    return {
      id: `re_${this.generateId()}`,
      payment_intent: paymentIntentId,
      amount: Math.round(amount * 100),
      status: 'succeeded',
      created: Date.now() / 1000
    };
  }

  /**
   * Retrieve payment intent
   */
  async retrievePaymentIntent(paymentIntentId) {
    await this.simulateDelay(100);

    return {
      id: paymentIntentId,
      status: 'succeeded',
      amount: 100000, // Mock amount
      currency: 'inr'
    };
  }

  // Utility methods
  generateId() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  detectCardBrand(cardNumber) {
    const firstDigit = cardNumber.charAt(0);
    const firstTwoDigits = cardNumber.substring(0, 2);

    if (firstDigit === '4') return 'visa';
    if (['51', '52', '53', '54', '55'].includes(firstTwoDigits)) return 'mastercard';
    if (['34', '37'].includes(firstTwoDigits)) return 'amex';
    if (firstTwoDigits === '60') return 'discover';
    if (firstTwoDigits === '35') return 'jcb';
    
    return 'unknown';
  }

  async simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
const stripe = new StripeMock(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key_123456789');

module.exports = stripe;
