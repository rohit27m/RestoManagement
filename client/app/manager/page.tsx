'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout';
import { Header, Container } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

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
    // Mock data for demonstration - replace with actual API calls
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

  const getStatusVariant = (status: string): 'success' | 'danger' | 'default' | 'outline' => {
    switch (status) {
      case 'preparing': return 'outline';
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

        <Container className="py-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Active Orders"
              value={stats.activeOrders}
              subtitle={`${stats.todayOrders} total today`}
              trend={{ value: 12, isPositive: true }}
            />

            <StatCard
              title="Today's Revenue"
              value={`₹${(stats.todayRevenue / 1000).toFixed(1)}K`}
              subtitle="Daily earnings"
              trend={{ value: 15, isPositive: true }}
            />

            <StatCard
              title="Table Occupancy"
              value={`${stats.occupiedTables}/${stats.totalTables}`}
              subtitle={`${Math.round((stats.occupiedTables / stats.totalTables) * 100)}% occupied`}
              trend={{ value: 8, isPositive: true }}
            />

            <StatCard
              title="Avg Order Value"
              value={`₹${Math.round(stats.todayRevenue / stats.todayOrders)}`}
              subtitle="Per transaction"
              trend={{ value: 8, isPositive: true }}
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-surface border border-default rounded-xl p-6 text-left hover:border-border-hover transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1">Manage Menu</h3>
              <p className="text-sm text-secondary">Add, edit or remove menu items</p>
            </motion.button>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-surface border border-default rounded-xl p-6 text-left hover:border-border-hover transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1">View Orders</h3>
              <p className="text-sm text-secondary">Track and manage active orders</p>
            </motion.button>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-surface border border-default rounded-xl p-6 text-left hover:border-border-hover transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1">Analytics</h3>
              <p className="text-sm text-secondary">View sales and performance metrics</p>
            </motion.button>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <motion.button
                  whileHover={{ x: 4 }}
                  className="text-success hover:text-success-hover text-sm font-medium flex items-center gap-1"
                >
                  View All
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-default">
                      <th className="text-left py-3 px-4 text-sm font-medium text-secondary">Table</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-secondary">Items</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-secondary">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-secondary">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-secondary">Time</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-secondary">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-default hover:bg-surface/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="font-medium">Table {order.table}</div>
                        </td>
                        <td className="py-4 px-4 text-secondary text-sm">{order.items}</td>
                        <td className="py-4 px-4 font-medium">₹{order.amount}</td>
                        <td className="py-4 px-4">
                          <Badge variant={getStatusVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-secondary text-sm">{order.time}</td>
                        <td className="py-4 px-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-secondary hover:text-foreground transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </motion.button>
                        </td>
                      </motion.tr>
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
