'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Input, Select, Button } from '@/components/ui';
import { generateInvoicePDF, previewInvoice, InvoiceData } from '@/lib/pdf-invoice';
import { formatDate } from '@/lib/utils';

interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  amount: number;
}

export function InvoiceGenerator() {
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now()}`);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', name: '', quantity: 1, price: 0, amount: 0 }
  ]);
  const [taxRate, setTaxRate] = useState(5);
  const [tip, setTip] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', quantity: 1, price: 0, amount: 0 }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          updated.amount = updated.quantity * updated.price;
        }
        return updated;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax + tip;

  const handleGeneratePDF = () => {
    const data: InvoiceData = {
      invoiceNumber,
      date: formatDate(new Date()),
      restaurantName: 'RestaurantOS',
      restaurantAddress: '123 Main St, Mumbai, India',
      restaurantPhone: '+91 98765 43210',
      customerName: customerName || undefined,
      tableNumber: tableNumber ? parseInt(tableNumber) : undefined,
      items: items.filter(item => item.name && item.quantity > 0),
      subtotal,
      tax,
      tip,
      total,
      paymentMethod,
    };

    generateInvoicePDF(data);
  };

  const handlePreview = () => {
    const data: InvoiceData = {
      invoiceNumber,
      date: formatDate(new Date()),
      restaurantName: 'RestaurantOS',
      restaurantAddress: '123 Main St, Mumbai, India',
      restaurantPhone: '+91 98765 43210',
      customerName: customerName || undefined,
      tableNumber: tableNumber ? parseInt(tableNumber) : undefined,
      items: items.filter(item => item.name && item.quantity > 0),
      subtotal,
      tax,
      tip,
      total,
      paymentMethod,
    };

    const url = previewInvoice(data);
    setPreviewUrl(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Invoice Form */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Invoice Number"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              required
            />
            <Input
              label="Table Number"
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />
          </div>

          <Input
            label="Customer Name (Optional)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <div className="border-t border-gray-800 pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Items</h3>
              <Button variant="secondary" size="sm" onClick={addItem}>
                + Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2">
                  <div className="col-span-5">
                    <Input
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-gray-400">₹{item.amount.toFixed(2)}</span>
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-2 text-red-500 hover:text-red-400"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Tax Rate (%)"
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              />
              <Input
                label="Tip (₹)"
                type="number"
                value={tip}
                onChange={(e) => setTip(parseFloat(e.target.value) || 0)}
              />
            </div>

            <Select
              label="Payment Method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              options={[
                { value: 'Cash', label: 'Cash' },
                { value: 'Card', label: 'Card' },
                { value: 'UPI', label: 'UPI' },
                { value: 'Wallet', label: 'Wallet' },
              ]}
            />
          </div>

          <div className="border-t border-gray-800 pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tax ({taxRate}%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              {tip > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Tip:</span>
                  <span>₹{tip.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-800">
                <span>Total:</span>
                <span className="text-green-500">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={handlePreview} className="flex-1">
              Preview
            </Button>
            <Button variant="primary" onClick={handleGeneratePDF} className="flex-1">
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {previewUrl ? (
            <iframe
              src={previewUrl}
              className="w-full h-[700px] border border-gray-800 rounded"
              title="Invoice Preview"
            />
          ) : (
            <div className="empty-state">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-lg font-semibold mb-2">No Preview</h3>
              <p className="text-gray-400 text-sm mb-4">
                Click "Preview" to see your invoice
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
