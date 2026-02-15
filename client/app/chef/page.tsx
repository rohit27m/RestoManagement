'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '../components/ThemeToggle';

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
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Table {order.table_number}</h3>
        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg">{getTimeAgo(order.created_at)}</span>
      </div>

      <div className="space-y-2.5 mb-4">
        {order.items.map((item: OrderItem) => (
          <div
            key={item.id}
            className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{item.item_name}</p>
                <div className="flex gap-2">
                  <span className="inline-block px-2 py-1 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium">
                    {item.portion}
                  </span>
                  <span className="inline-block px-2 py-1 bg-slate-900 dark:bg-slate-600 text-white rounded-lg text-xs font-medium">
                    ×{item.quantity}
                  </span>
                </div>
                {item.notes && (
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-2 italic">Note: {item.notes}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showButton && (
        <button
          onClick={() => onButtonClick(order.id)}
          className={`w-full py-3 rounded-xl font-semibold text-white transition shadow-sm hover:shadow ${buttonColor}`}
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="RestoTrack Logo" 
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Chef Dashboard</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Kitchen order management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.username}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
            </div>
            <ThemeToggle />
            <button
              onClick={logout}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition border border-slate-200 dark:border-slate-600"
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
            <div className="bg-white dark:bg-slate-800 border-2 border-amber-200 dark:border-amber-800 rounded-t-2xl px-5 py-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                Pending ({pendingOrders.length})
              </h2>
            </div>
            <div className="bg-amber-50/30 dark:bg-amber-950/20 border-2 border-t-0 border-amber-200 dark:border-amber-800 p-4 rounded-b-2xl min-h-[400px]">
              {pendingOrders.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">No pending orders</p>
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
            <div className="bg-white dark:bg-slate-800 border-2 border-sky-200 dark:border-sky-800 rounded-t-2xl px-5 py-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></span>
                Preparing ({preparingOrders.length})
              </h2>
            </div>
            <div className="bg-sky-50/30 dark:bg-sky-950/20 border-2 border-t-0 border-sky-200 dark:border-sky-800 p-4 rounded-b-2xl min-h-[400px]">
              {preparingOrders.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8 text-sm">No orders in preparation</p>
              ) : (
                preparingOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    showButton={true}
                    buttonText="Mark Ready"
                    buttonColor="bg-emerald-600 hover:bg-emerald-700"
                    onButtonClick={(id: number) => updateOrderStatus(id, 'ready')}
                  />
                ))
              )}
            </div>
          </div>

          {/* Ready Orders */}
          <div>
            <div className="bg-white dark:bg-slate-800 border-2 border-emerald-200 dark:border-emerald-800 rounded-t-2xl px-5 py-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                Ready ({readyOrders.length})
              </h2>
            </div>
            <div className="bg-emerald-50/30 dark:bg-emerald-950/20 border-2 border-t-0 border-emerald-200 dark:border-emerald-800 p-4 rounded-b-2xl min-h-[400px]">
              {readyOrders.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">No orders ready</p>
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
