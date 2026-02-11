'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  role: string;
}

interface Order {
  id: number;
  table_number: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  item_name: string;
  portion: string;
  quantity: number;
  notes?: string;
  status: string;
}

export default function ChefDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [preparingOrders, setPreparingOrders] = useState<Order[]>([]);
  const [readyOrders, setReadyOrders] = useState<Order[]>([]);

  useEffect(() => {
    checkAuth();
    const interval = setInterval(loadOrders, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/session', {
        credentials: 'include',
      });
      if (response.ok) {
        const userData = await response.json();
        if (userData.role !== 'chef') {
          alert('Access denied. Chef login required.');
          router.push('/');
        } else {
          setUser(userData);
          loadOrders();
        }
      } else {
        router.push('/');
      }
    } catch (error) {
      router.push('/');
    }
  };

  const logout = async () => {
    await fetch('http://localhost:4000/api/logout', {
      method: 'POST',
      credentials: 'include',
    });
    router.push('/');
  };

  const loadOrders = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/orders', {
        credentials: 'include',
      });
      const orders = await response.json();
      
      setPendingOrders(orders.filter((o: Order) => o.status === 'pending'));
      setPreparingOrders(orders.filter((o: Order) => o.status === 'preparing'));
      setReadyOrders(orders.filter((o: Order) => o.status === 'ready'));
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        loadOrders();
      }
    } catch (error) {
      alert('Error updating order status');
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const orderTime = new Date(timestamp);
    const diffMs = now.getTime() - orderTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;

    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ${diffMins % 60}m ago`;
  };

  const OrderCard = ({ order, showButton, buttonText, buttonColor, onButtonClick }: any) => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold">Table {order.table_number}</h3>
        <span className="text-sm text-gray-500">{getTimeAgo(order.created_at)}</span>
      </div>

      <div className="space-y-2 mb-4">
        {order.items.map((item: OrderItem) => (
          <div
            key={item.id}
            className="p-2 bg-gray-50 rounded border-l-4 border-indigo-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <strong>{item.item_name}</strong>
                <div className="text-sm text-gray-600">
                  <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs mr-2">
                    {item.portion}
                  </span>
                  <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                    x{item.quantity}
                  </span>
                </div>
                {item.notes && (
                  <div className="text-xs text-gray-500 mt-1">Note: {item.notes}</div>
                )}
              </div>
              <span className="text-xs px-2 py-1 bg-gray-200 rounded capitalize">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showButton && (
        <button
          onClick={() => onButtonClick(order.id)}
          className={`w-full py-2 rounded-lg font-semibold text-white transition ${buttonColor}`}
        >
          {buttonText}
        </button>
      )}
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">👨‍🍳 Chef Dashboard</h1>
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

      {/* Orders Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending Orders */}
          <div>
            <div className="bg-yellow-100 rounded-t-lg px-4 py-3 border-b-2 border-yellow-300">
              <h2 className="text-lg font-bold text-yellow-800">
                Pending Orders ({pendingOrders.length})
              </h2>
            </div>
            <div className="bg-yellow-50 p-4 rounded-b-lg min-h-[400px]">
              {pendingOrders.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No pending orders</p>
              ) : (
                pendingOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    showButton={true}
                    buttonText="Start Preparing"
                    buttonColor="bg-blue-600 hover:bg-blue-700"
                    onButtonClick={(id: number) => updateOrderStatus(id, 'preparing')}
                  />
                ))
              )}
            </div>
          </div>

          {/* Preparing Orders */}
          <div>
            <div className="bg-blue-100 rounded-t-lg px-4 py-3 border-b-2 border-blue-300">
              <h2 className="text-lg font-bold text-blue-800">
                Preparing ({preparingOrders.length})
              </h2>
            </div>
            <div className="bg-blue-50 p-4 rounded-b-lg min-h-[400px]">
              {preparingOrders.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No orders in preparation</p>
              ) : (
                preparingOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    showButton={true}
                    buttonText="Mark Ready"
                    buttonColor="bg-green-600 hover:bg-green-700"
                    onButtonClick={(id: number) => updateOrderStatus(id, 'ready')}
                  />
                ))
              )}
            </div>
          </div>

          {/* Ready Orders */}
          <div>
            <div className="bg-green-100 rounded-t-lg px-4 py-3 border-b-2 border-green-300">
              <h2 className="text-lg font-bold text-green-800">
                Ready to Serve ({readyOrders.length})
              </h2>
            </div>
            <div className="bg-green-50 p-4 rounded-b-lg min-h-[400px]">
              {readyOrders.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No orders ready</p>
              ) : (
                readyOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    showButton={true}
                    buttonText="Mark Served"
                    buttonColor="bg-gray-600 hover:bg-gray-700"
                    onButtonClick={(id: number) => updateOrderStatus(id, 'served')}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
