'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Badge, StatCard, Button } from '@/components/ui';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
      { id: 4, table: 2, items: 'Chicken Tikka, Masala Tea', amount: 380, status: 'preparing', time: '2m ago' },
    ]);
  }, []);

  return (
    <ProtectedRoute allowedRoles={['manager']}>
      <DashboardLayout role="manager">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold tracking-tight text-foreground"
              >
                Restaurant Pulse
              </motion.h2>
              <p className="text-muted-foreground text-sm font-medium mt-1">
                Welcome back, <span className="text-primary">{user?.username || 'Manager'}</span>. Here's what's happening.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm">Print Daily Summary</Button>
              <Button variant="primary" size="sm" leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
              }>
                New Order
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Active Flow"
              value={stats.activeOrders}
              subtitle="Orders in kitchen"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6.5l1.09 1.09" /><path d="M10.5 10.5 13 8" /><path d="M18 6.13A4 4 0 0 1 16.59 13.5l-1.09-1.09" /><path d="M13.5 13.5 11 16" /></svg>}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Revenue"
              value={stats.todayRevenue}
              subtitle="Earned today"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>}
              trend={{ value: 15, isPositive: true }}
            />
            <StatCard
              title="Capacity"
              value={`${stats.occupiedTables}/${stats.totalTables}`}
              subtitle="Tables occupied"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h18" /><path d="M3 14h18" /><path d="M3 18h18" /><path d="M3 6h18" /></svg>}
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Efficiency"
              value={Math.round(stats.todayRevenue / stats.todayOrders)}
              subtitle="Avg order value"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>}
              trend={{ value: 4.2, isPositive: true }}
            />
          </div>

          {/* Quick Actions & Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Live Orders</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">Real-time status of current kitchen flow</p>
                  </div>
                  <Button variant="ghost" size="sm">Manage All</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-muted/30 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-secondary flex flex-col items-center justify-center border border-border">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none">TBL</span>
                            <span className="text-lg font-bold text-foreground leading-none">{order.table}</span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-foreground">{order.items}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{order.time}</span>
                              <span className="w-1 h-1 rounded-full bg-border" />
                              <span className="text-xs font-bold text-foreground">₹{order.amount}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={cn(
                            "border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
                            order.status === 'preparing' ? 'bg-amber-500/10 text-amber-500' :
                              order.status === 'served' ? 'bg-sky-500/10 text-sky-500' :
                                'bg-emerald-500/10 text-emerald-500'
                          )}>
                            {order.status}
                          </Badge>
                          <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 text-left flex flex-col gap-4 relative overflow-hidden group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M2 12h20" /><path d="m4.93 4.93 14.14 14.14" /><path d="m4.93 19.07 14.14-14.14" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Menu Creator</h3>
                    <p className="text-sm opacity-80 font-medium">Add new signature dishes</p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
                    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M2 12h20" /></svg>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all text-left flex flex-col gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h18" /><path d="M3 14h18" /><path d="M3 18h18" /><path d="M3 6h18" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">Table Hub</h3>
                    <p className="text-sm text-muted-foreground font-medium">Manage floor plan and bookings</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all text-left flex flex-col gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">Invoice Gen</h3>
                    <p className="text-sm text-muted-foreground font-medium">Review and generate bills</p>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
