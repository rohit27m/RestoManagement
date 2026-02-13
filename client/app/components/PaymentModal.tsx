'use client';

import { useState, useEffect } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  billData: {
    subtotal: number;
    tax: number;
    total: number;
    order: any;
    restaurant: any;
  };
  onPaymentComplete: () => void;
}

type PaymentMethod = 'cash' | 'card' | 'upi' | 'wallet';

interface Split {
  amount: number;
  percentage: number;
  payerName: string;
  payerEmail?: string;
}

export default function PaymentModal({ isOpen, onClose, orderId, billData, onPaymentComplete }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [tipPercentage, setTipPercentage] = useState<number>(0);
  const [customTip, setCustomTip] = useState<string>('');
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [finalTotal, setFinalTotal] = useState<number>(0);
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [splitBill, setSplitBill] = useState<boolean>(false);
  const [numberOfSplits, setNumberOfSplits] = useState<number>(2);
  const [splits, setSplits] = useState<Split[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);
  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>('');

  // Card details (for demo - in production use Stripe Elements)
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCVV, setCardCVV] = useState<string>('');

  // UPI details
  const [upiId, setUpiId] = useState<string>('');

  // Wallet details
  const [walletProvider, setWalletProvider] = useState<string>('paytm');

  useEffect(() => {
    if (billData) {
      calculateTotal();
    }
  }, [tipPercentage, customTip, billData]);

  useEffect(() => {
    if (splitBill) {
      calculateSplits();
    }
  }, [numberOfSplits, finalTotal, splitBill]);

  const calculateTotal = async () => {
    if (!billData) return;

    try {
      const response = await fetch('http://localhost:4000/api/payment/calculate-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          orderId,
          tipPercentage: tipPercentage || undefined,
          customTipAmount: customTip ? parseFloat(customTip) : undefined
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTipAmount(data.tipAmount);
        setFinalTotal(data.finalTotal);
      }
    } catch (error) {
      console.error('Error calculating tip:', error);
    }
  };

  const calculateSplits = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/payment/calculate-split', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          orderId,
          numberOfSplits
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSplits(data.splits.map((split: any) => ({
          ...split,
          payerName: '',
          payerEmail: ''
        })));
      }
    } catch (error) {
      console.error('Error calculating splits:', error);
    }
  };

  const handlePayment = async () => {
    if (!validatePaymentDetails()) return;

    setProcessing(true);

    try {
      // Prepare payment data
      const paymentData: any = {
        orderId,
        paymentMethod,
        amount: finalTotal,
        tipAmount,
        customerEmail: customerEmail || undefined,
        customerName: customerName || undefined,
        splits: splitBill ? splits : undefined
      };

      // Add payment method specific details
      if (paymentMethod === 'card') {
        // In production, tokenize with Stripe Elements
        paymentData.paymentToken = {
          type: 'card',
          card: {
            number: cardNumber,
            exp_month: cardExpiry.split('/')[0],
            exp_year: cardExpiry.split('/')[1],
            cvc: cardCVV
          }
        };
      } else if (paymentMethod === 'upi') {
        paymentData.paymentToken = {
          type: 'upi',
          upi: { vpa: upiId }
        };
      } else if (paymentMethod === 'wallet') {
        paymentData.paymentToken = {
          type: 'wallet',
          wallet: { provider: walletProvider, email: customerEmail }
        };
      }

      const response = await fetch('http://localhost:4000/api/payment/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(paymentData)
      });

      if (response.ok) {
        const result = await response.json();
        setTransactionId(result.transactionId);
        setShowReceipt(true);
        setTimeout(() => {
          onPaymentComplete();
          onClose();
        }, 3000);
      } else {
        const error = await response.json();
        alert(`Payment failed: ${error.error}`);
      }
    } catch (error) {
      alert('Payment processing error. Please try again.');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const validatePaymentDetails = (): boolean => {
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCVV) {
        alert('Please enter complete card details');
        return false;
      }
      if (cardNumber.replace(/\s/g, '').length < 13) {
        alert('Invalid card number');
        return false;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        alert('Please enter valid UPI ID');
        return false;
      }
    }

    return true;
  };

  if (!isOpen || !billData) return null;

  if (showReceipt) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Transaction ID: {transactionId}</p>
          {customerEmail && (
            <p className="text-sm text-gray-500">Receipt sent to {customerEmail}</p>
          )}
          <p className="text-lg font-semibold mt-4">₹{finalTotal.toFixed(2)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Process Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        {/* Bill Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">Bill Summary</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{billData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({billData.restaurant.tax_rate}%):</span>
              <span>₹{billData.tax.toFixed(2)}</span>
            </div>
            {tipAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Tip:</span>
                <span>₹{tipAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Total:</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Tip Section */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Add Tip (Optional)</h3>
          <div className="flex gap-2 mb-3">
            {[0, 5, 10, 15, 20].map(percent => (
              <button
                key={percent}
                onClick={() => {
                  setTipPercentage(percent);
                  setCustomTip('');
                }}
                className={`flex-1 py-2 rounded-lg border ${
                  tipPercentage === percent && !customTip
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white border-gray-300 hover:border-blue-600'
                }`}
              >
                {percent}%
              </button>
            ))}
          </div>
          <input
            type="number"
            placeholder="Custom tip amount"
            value={customTip}
            onChange={(e) => {
              setCustomTip(e.target.value);
              setTipPercentage(0);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Split Bill Option */}
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={splitBill}
              onChange={(e) => setSplitBill(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="font-semibold">Split Bill</span>
          </label>
          
          {splitBill && (
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-sm mb-1">Number of splits:</label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={numberOfSplits}
                  onChange={(e) => setNumberOfSplits(parseInt(e.target.value) || 2)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                {splits.map((split, index) => (
                  <div key={index} className="text-sm mb-2">
                    Person {index + 1}: ₹{split.amount.toFixed(2)} ({split.percentage}%)
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Payment Method</h3>
          <div className="grid grid-cols-2 gap-3">
            {(['cash', 'card', 'upi', 'wallet'] as PaymentMethod[]).map(method => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`py-3 px-4 rounded-lg border-2 font-medium capitalize ${
                  paymentMethod === method
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white border-gray-300 hover:border-blue-600'
                }`}
              >
                {method === 'cash' && '💵'} {method === 'card' && '💳'}
                {method === 'upi' && '📱'} {method === 'wallet' && '👛'} {method}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method Details */}
        {paymentMethod === 'card' && (
          <div className="mb-6 space-y-3">
            <input
              type="text"
              placeholder="Card Number (1234 5678 9012 3456)"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              maxLength={19}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                maxLength={5}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="CVV"
                value={cardCVV}
                onChange={(e) => setCardCVV(e.target.value)}
                maxLength={4}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}

        {paymentMethod === 'upi' && (
          <div className="mb-6">
            <input
              type="text"
              placeholder="UPI ID (example@upi)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        )}

        {paymentMethod === 'wallet' && (
          <div className="mb-6">
            <label className="block text-sm mb-2">Select Wallet:</label>
            <select
              value={walletProvider}
              onChange={(e) => setWalletProvider(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="paytm">Paytm</option>
              <option value="phonepe">PhonePe</option>
              <option value="googlepay">Google Pay</option>
              <option value="amazonpay">Amazon Pay</option>
            </select>
          </div>
        )}

        {/* Customer Details */}
        <div className="mb-6 space-y-3">
          <h3 className="font-semibold">Customer Details (Optional)</h3>
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="email"
            placeholder="Email for digital receipt"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={processing}
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={processing}
            className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold"
          >
            {processing ? 'Processing...' : `Pay ₹${finalTotal.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
