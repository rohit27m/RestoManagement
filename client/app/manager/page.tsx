'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout';
import { Header, Container } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  activeOrders: number;
  totalTables: number;
  occupiedTables: number;
}

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    todayOrders: 0,
    todayRevenue: 0,
    activeOrders: 0,
    totalTables: 0,
    occupiedTables: 0,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    // Mock data - replace with API call
    setStats({
      todayOrders: 45,
      todayRevenue: 28500,
      activeOrders: 8,
      totalTables: 10,
      occupiedTables: 6,
    });

    setRecentOrders([
      { id: 1, table: 3, items: 'Butter Chicken, Naan x2', amount: 850, status: 'preparing', time: '5m ago' },
      { id: 2, table: 7, items: 'Paneer Tikka, Dal Makhani', amount: 720, status: 'served', time: '12m ago' },
      { id: 3, table: 5, items: 'Biryani, Raita', amount: 450, status: 'completed', time: '25m ago' },
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'warning';
      case 'served': return 'success';
      case 'completed': return 'default';
      default: return 'danger';
    }
  };

  return (
    <ProtectedRoute allowedRoles={['manager']}>
      <DashboardLayout role="manager">
        <Header
          title="Manager Dashboard"
          subtitle={`Welcome back, ${user?.username}`}
        />

        <Container className="py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">🛎️</span>
                <Badge variant="success">Live</Badge>
              </div>
              <h3 className="text-3xl font-bold">{stats.activeOrders}</h3>
              <p className="text-gray-400 text-sm mt-1">Active Orders</p>
              <p className="text-gray-400 text-xs mt-2">
                {stats.todayOrders} total today
              </p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">💰</span>
              </div>
              <h3 className="text-3xl font-bold">₹{(stats.todayRevenue / 1000).toFixed(1)}K</h3>
              <p className="text-gray-400 text-sm mt-1">Today's Revenue</p>
              <p className="text-green-500 text-xs mt-2">+15% vs yesterday</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">🪑</span>
              </div>
              <h3 className="text-3xl font-bold">
                {stats.occupiedTables}/{stats.totalTables}
              </h3>
              <p className="text-gray-400 text-sm mt-1">Tables Occupied</p>
              <p className="text-gray-400 text-xs mt-2">
                {Math.round((stats.occupiedTables / stats.totalTables) * 100)}% occupancy
              </p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-3xl font-bold">
                ₹{Math.round(stats.todayRevenue / stats.todayOrders)}
              </h3>
              <p className="text-gray-400 text-sm mt-1">Avg Order Value</p>
              <p className="text-green-500 text-xs mt-2">+8% vs yesterday</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button className="card-hover p-6 text-left">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="font-semibold mb-1">Manage Menu</h3>
              <p className="text-sm text-gray-400">Add, edit or remove menu items</p>
            </button>

            <button className="card-hover p-6 text-left">
              <div className="text-4xl mb-3">🛎️</div>
              <h3 className="font-semibold mb-1">View Orders</h3>
              <p className="text-sm text-gray-400">Track and manage active orders</p>
            </button>

            <button className="card-hover p-6 text-left">
              <div className="text-4xl mb-3">📈</div>
              <h3 className="font-semibold mb-1">Analytics</h3>
              <p className="text-sm text-gray-400">View sales and performance metrics</p>
            </button>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <button className="text-green-500 hover:text-green-400 text-sm">
                  View All →
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Table</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <div className="font-medium">Table {order.table}</div>
                        </td>
                        <td className="text-gray-400">{order.items}</td>
                        <td className="font-medium">₹{order.amount}</td>
                        <td>
                          <Badge variant={getStatusColor(order.status) as any}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="text-gray-400 text-sm">{order.time}</td>
                        <td>
                          <div className="flex gap-2">
                            <button className="text-gray-400 hover:text-white">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
