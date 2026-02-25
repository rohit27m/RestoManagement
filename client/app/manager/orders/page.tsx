'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Order {
  id: number;
  table: number;
  waiter: string;
  items: string;
  amount: number;
  status: 'preparing' | 'served' | 'completed' | 'cancelled';
  time: string;
}

const statusVariantMap: Record<string, 'warning' | 'primary' | 'success' | 'danger'> = {
  preparing: 'warning',
  served: 'primary',
  completed: 'success',
  cancelled: 'danger',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'preparing' | 'served' | 'completed'>('all');

  useEffect(() => {
    setOrders([
      { id: 1, table: 3, waiter: 'Rahul', items: 'Butter Chicken, Naan x2', amount: 850, status: 'preparing', time: '5m ago' },
      { id: 2, table: 7, waiter: 'Priya', items: 'Paneer Tikka, Dal Makhani', amount: 720, status: 'served', time: '12m ago' },
      { id: 3, table: 5, waiter: 'Aman', items: 'Biryani, Raita', amount: 450, status: 'completed', time: '25m ago' },
      { id: 4, table: 2, waiter: 'Neha', items: 'Chicken Tikka, Masala Tea', amount: 380, status: 'preparing', time: '2m ago' },
      { id: 5, table: 8, waiter: 'Vikram', items: 'Mutton Rogan Josh, Garlic Naan', amount: 1100, status: 'served', time: '18m ago' },
      { id: 6, table: 1, waiter: 'Rahul', items: 'Veg Thali x2', amount: 600, status: 'completed', time: '40m ago' },
    ]);
  }, []);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <ProtectedRoute allowedRoles={['manager', 'admin']}>
      <DashboardLayout role="manager">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold tracking-tight text-foreground"
              >
                Orders
              </motion.h2>
              <p className="text-muted-foreground text-sm font-medium mt-1">
                Live view of all restaurant orders
              </p>
            </div>
            <Button variant="secondary" size="sm">Export CSV</Button>
          </div>

          {/* Filter Tabs */}
          <div className="inline-flex p-1 bg-secondary rounded-2xl border border-border/50 gap-1">
            {(['all', 'preparing', 'served', 'completed'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`relative px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-300 ${
                  filter === tab
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                {filter === 'all' ? 'All Orders' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Orders`}
                <span className="ml-2 text-sm text-muted-foreground font-normal">({filtered.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-left py-3 px-4 font-semibold">Order #</th>
                      <th className="text-left py-3 px-4 font-semibold">Table</th>
                      <th className="text-left py-3 px-4 font-semibold">Waiter</th>
                      <th className="text-left py-3 px-4 font-semibold">Items</th>
                      <th className="text-left py-3 px-4 font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Time</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((order, i) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="py-3 px-4 font-semibold text-foreground">#{order.id}</td>
                        <td className="py-3 px-4 text-muted-foreground">Table {order.table}</td>
                        <td className="py-3 px-4 text-muted-foreground">{order.waiter}</td>
                        <td className="py-3 px-4 text-muted-foreground max-w-[200px] truncate">{order.items}</td>
                        <td className="py-3 px-4 text-muted-foreground">₹{order.amount}</td>
                        <td className="py-3 px-4">
                          <Badge variant={statusVariantMap[order.status]}>{order.status}</Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{order.time}</td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm">View</Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
