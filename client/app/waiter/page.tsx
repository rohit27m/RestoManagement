'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  role: string;
}

interface Table {
  id: number;
  table_number: number;
  capacity: number;
  status: string;
  active_order_id?: number;
  order_status?: string;
}

interface MenuItem {
  id: number;
  name: string;
  category: string;
  half_price?: number;
  full_price: number;
  available: boolean;
}

interface OrderItem {
  menu_item_id: number;
  name: string;
  portion: 'half' | 'full';
  price: number;
  quantity: number;
  notes?: string;
}

interface Order {
  id: number;
  table_id: number;
  table_number: number;
  waiter_name: string;
  status: string;
  total_amount: number;
  created_at: string;
  items: any[];
}

export default function WaiterDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('tables');
  const [tables, setTables] = useState<Table[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [currentTableId, setCurrentTableId] = useState<number | null>(null);
  const [currentTableNumber, setCurrentTableNumber] = useState<number>(0);
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem>>({});
  const [billData, setBillData] = useState<any>(null);
  const [restaurant, setRestaurant] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (activeTab === 'tables') loadTables();
    else if (activeTab === 'orders') loadOrders();
    else if (activeTab === 'menu') loadMenu();
    else if (activeTab === 'settings') loadSettings();
  }, [activeTab]);

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/session', {
        credentials: 'include',
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        loadTables();
      } else {
        router.push('/');
      }
    } catch (error) {
      router.push('/');
    }
  };

  const logout = async () => {
    await fetch('http://localhost:3000/api/logout', {
      method: 'POST',
      credentials: 'include',
    });
    router.push('/');
  };

  const loadTables = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/tables', {
        credentials: 'include',
      });
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Error loading tables:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        credentials: 'include',
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadMenu = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/menu', {
        credentials: 'include',
      });
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error loading menu:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/restaurant', {
        credentials: 'include',
      });
      const data = await response.json();
      setRestaurant(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const openOrderModal = async (tableId: number, tableNumber: number) => {
    setCurrentTableId(tableId);
    setCurrentTableNumber(tableNumber);
    setOrderItems({});
    await loadMenu();
    setShowOrderModal(true);
  };

  const addToOrder = (menuItem: MenuItem, portion: 'half' | 'full') => {
    const price = portion === 'half' ? menuItem.half_price! : menuItem.full_price;
    const key = `${menuItem.id}-${portion}`;
    
    setOrderItems(prev => {
      if (prev[key]) {
        return {
          ...prev,
          [key]: { ...prev[key], quantity: prev[key].quantity + 1 }
        };
      } else {
        return {
          ...prev,
          [key]: {
            menu_item_id: menuItem.id,
            name: menuItem.name,
            portion,
            price,
            quantity: 1
          }
        };
      }
    });
  };

  const removeFromOrder = (key: string) => {
    setOrderItems(prev => {
      const newItems = { ...prev };
      if (newItems[key].quantity > 1) {
        newItems[key] = { ...newItems[key], quantity: newItems[key].quantity - 1 };
      } else {
        delete newItems[key];
      }
      return newItems;
    });
  };

  const submitOrder = async () => {
    const items = Object.values(orderItems);
    
    if (items.length === 0) {
      alert('Please add items to the order');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          table_id: currentTableId,
          items: items.map(item => ({
            menu_item_id: item.menu_item_id,
            portion: item.portion,
            quantity: item.quantity
          }))
        })
      });

      if (response.ok) {
        alert('Order placed successfully!');
        setShowOrderModal(false);
        loadTables();
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      alert('Error placing order');
    }
  };

  const viewBill = async (orderId: number) => {
    setCurrentOrderId(orderId);
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}/bill`, {
        credentials: 'include',
      });
      const data = await response.json();
      setBillData(data);
      setShowBillModal(true);
    } catch (error) {
      alert('Error loading bill');
    }
  };

  const completeOrder = async () => {
    if (!currentOrderId) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${currentOrderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'completed' })
      });

      if (response.ok) {
        alert('Order completed!');
        setShowBillModal(false);
        loadTables();
      }
    } catch (error) {
      alert('Error completing order');
    }
  };

  const orderTotal = Object.values(orderItems).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const categories = [...new Set(menuItems.map(item => item.category))];

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">🍽️ Waiter Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user.username}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4">
            {['tables', 'orders', 'menu', 'settings'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize border-b-2 transition ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tables Tab */}
        {activeTab === 'tables' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Table Status</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {tables.map(table => (
                <div
                  key={table.id}
                  className={`p-6 rounded-lg shadow-sm border-2 ${
                    table.status === 'available'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800 mb-2">
                      {table.table_number}
                    </div>
                    <div className={`text-sm font-medium mb-3 capitalize ${
                      table.status === 'available' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {table.status}
                    </div>
                    {table.status === 'available' ? (
                      <button
                        onClick={() => openOrderModal(table.id, table.table_number)}
                        className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition"
                      >
                        New Order
                      </button>
                    ) : table.active_order_id ? (
                      <button
                        onClick={() => viewBill(table.active_order_id!)}
                        className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition"
                      >
                        View Bill
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Orders</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500">No active orders</p>
            ) : (
              <div className="grid gap-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Table {order.table_number} - Order #{order.id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Status: <span className="font-medium capitalize">{order.status}</span>
                        </p>
                        <p className="text-sm text-gray-600">Waiter: {order.waiter_name}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => viewBill(order.id)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition"
                      >
                        View Bill
                      </button>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>
                            {item.item_name} ({item.portion}) x{item.quantity}
                          </span>
                          <span className="font-medium">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>₹{order.total_amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
            <div className="space-y-6">
              {categories.map(category => (
                <div key={category}>
                  <h3 className="text-lg font-semibold mb-3">{category || 'Other'}</h3>
                  <div className="grid gap-3">
                    {menuItems
                      .filter(item => item.category === category)
                      .map(item => (
                        <div
                          key={item.id}
                          className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center"
                        >
                          <span className="font-medium">{item.name}</span>
                          <div className="flex gap-2">
                            {item.half_price && (
                              <span className="text-sm text-gray-600">
                                Half: ₹{item.half_price.toFixed(2)}
                              </span>
                            )}
                            <span className="text-sm font-medium">
                              Full: ₹{item.full_price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && restaurant && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Restaurant Settings</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    value={restaurant.name}
                    readOnly
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={restaurant.address}
                    readOnly
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={restaurant.phone}
                    readOnly
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={restaurant.tax_rate}
                    readOnly
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                New Order - Table {currentTableNumber}
              </h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Menu Items</h3>
                <div className="space-y-4">
                  {categories.map(category => (
                    <div key={category}>
                      <h4 className="font-medium text-gray-700 mb-2">
                        {category || 'Other'}
                      </h4>
                      <div className="space-y-2">
                        {menuItems
                          .filter(item => item.category === category && item.available)
                          .map(item => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                            >
                              <span>{item.name}</span>
                              <div className="flex gap-2">
                                {item.half_price && (
                                  <button
                                    onClick={() => addToOrder(item, 'half')}
                                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition"
                                  >
                                    Half (₹{item.half_price})
                                  </button>
                                )}
                                <button
                                  onClick={() => addToOrder(item, 'full')}
                                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition"
                                >
                                  Full (₹{item.full_price})
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                {Object.keys(orderItems).length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No items added</p>
                ) : (
                  <div className="space-y-2 mb-4">
                    {Object.entries(orderItems).map(([key, item]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <span>
                          {item.name} ({item.portion})
                        </span>
                        <div className="flex items-center gap-4">
                          <span>x{item.quantity}</span>
                          <span className="font-medium">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromOrder(key)}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition"
                          >
                            -
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg mb-4">
                  <span className="font-semibold text-lg">Total:</span>
                  <span className="font-bold text-xl text-indigo-600">
                    ₹{orderTotal.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={submitOrder}
                  disabled={Object.keys(orderItems).length === 0}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bill Modal */}
      {showBillModal && billData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Bill</h2>
              <button
                onClick={() => setShowBillModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-8">
              <div className="text-center mb-6 pb-6 border-b">
                <h2 className="text-2xl font-bold">{billData.restaurant.name}</h2>
                <p className="text-gray-600">{billData.restaurant.address}</p>
                <p className="text-gray-600">{billData.restaurant.phone}</p>
              </div>

              <div className="mb-6 pb-4 border-b text-sm">
                <p><strong>Order #{billData.order.id}</strong></p>
                <p>Table: {billData.order.table_number}</p>
                <p>Date: {new Date(billData.order.created_at).toLocaleString()}</p>
                <p>Waiter: {billData.order.waiter_name}</p>
              </div>

              <table className="w-full mb-6">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Item</th>
                    <th className="text-center py-2">Qty</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {billData.order.items.map((item: any, idx: number) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2">
                        {item.item_name} ({item.portion})
                      </td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-right">₹{item.price.toFixed(2)}</td>
                      <td className="text-right">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{billData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({billData.restaurant.tax_rate}%):</span>
                  <span>₹{billData.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t">
                  <span>Grand Total:</span>
                  <span>₹{billData.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center text-gray-600 mb-6">
                <p>Thank you for dining with us!</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                >
                  Print Bill
                </button>
                <button
                  onClick={completeOrder}
                  className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                >
                  Complete & Close Table
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
