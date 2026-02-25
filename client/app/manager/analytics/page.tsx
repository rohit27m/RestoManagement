'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, StatCard } from '@/components/ui';
import { motion } from 'framer-motion';

const mockWeeklyRevenue = [
  { day: 'Mon', revenue: 4200 },
  { day: 'Tue', revenue: 5800 },
  { day: 'Wed', revenue: 3900 },
  { day: 'Thu', revenue: 6100 },
  { day: 'Fri', revenue: 7200 },
  { day: 'Sat', revenue: 8500 },
  { day: 'Sun', revenue: 7800 },
];

const maxRevenue = Math.max(...mockWeeklyRevenue.map(d => d.revenue));

const mockTopItems = [
  { name: 'Butter Chicken', orders: 142, revenue: 92300 },
  { name: 'Paneer Tikka', orders: 118, revenue: 70800 },
  { name: 'Biryani', orders: 99, revenue: 44550 },
  { name: 'Dal Makhani', orders: 87, revenue: 34800 },
  { name: 'Garlic Naan', orders: 201, revenue: 20100 },
];

export default function ManagerAnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={['manager', 'admin']}>
      <DashboardLayout role="manager">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold tracking-tight text-foreground"
            >
              Insights
            </motion.h2>
            <p className="text-muted-foreground text-sm font-medium mt-1">
              Restaurant performance breakdown
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Weekly Revenue"
              value={43500}
              subtitle="This week"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
              trend={{ value: 9.8, isPositive: true }}
            />
            <StatCard
              title="Total Orders"
              value={287}
              subtitle="This week"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /></svg>}
              trend={{ value: 5.2, isPositive: true }}
            />
            <StatCard
              title="Avg Order"
              value={151}
              subtitle="Per order value"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>}
              trend={{ value: 2.1, isPositive: true }}
            />
            <StatCard
              title="Peak Hour"
              value="7PM"
              subtitle="Highest traffic"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
              trend={{ value: 0, isPositive: true }}
            />
          </div>

          {/* Weekly Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4 h-48 pt-4">
                {mockWeeklyRevenue.map((d, i) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      ₹{(d.revenue / 1000).toFixed(1)}k
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.revenue / maxRevenue) * 140}px` }}
                      transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
                      className="w-full rounded-t-lg bg-primary/80 hover:bg-primary transition-colors cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground">{d.day}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Menu Items */}
          <Card>
            <CardHeader>
              <CardTitle>Top Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTopItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-bold text-muted-foreground w-5 text-right shrink-0">#{i + 1}</span>
                      <span className="font-semibold text-sm text-foreground truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <span className="text-sm text-muted-foreground">{item.orders} orders</span>
                      <span className="text-sm font-semibold text-foreground w-24 text-right">₹{item.revenue.toLocaleString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
