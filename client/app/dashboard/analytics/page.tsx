'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, StatCard } from '@/components/ui';
import { motion } from 'framer-motion';

const mockMonthlyRevenue = [
  { month: 'Sep', revenue: 520000 },
  { month: 'Oct', revenue: 610000 },
  { month: 'Nov', revenue: 580000 },
  { month: 'Dec', revenue: 720000 },
  { month: 'Jan', revenue: 690000 },
  { month: 'Feb', revenue: 640000 },
];

const maxRevenue = Math.max(...mockMonthlyRevenue.map(d => d.revenue));

const mockTopRestaurants = [
  { name: 'Urban Cafe', location: 'Bangalore', revenue: 580000, orders: 1450, growth: 12.4 },
  { name: 'Downtown Bistro', location: 'Mumbai', revenue: 450000, orders: 1250, growth: 8.1 },
  { name: 'Coastal Kitchen', location: 'Goa', revenue: 320000, orders: 890, growth: 5.3 },
  { name: 'Mountain Grill', location: 'Manali', revenue: 290000, orders: 750, growth: -2.1 },
];

export default function AdminAnalyticsPage() {
  return (
    <ProtectedRoute >
      <DashboardLayout >
        <div className="p-8 space-y-8">
          {/* Header */}
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold tracking-tight text-foreground"
            >
              Analytics
            </motion.h2>
            <p className="text-muted-foreground text-sm font-medium mt-1">
              Network-wide performance insights
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Revenue"
              value={1640000}
              subtitle="Last 6 months"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
              trend={{ value: 12.5, isPositive: true }}
            />
            <StatCard
              title="Total Orders"
              value={4340}
              subtitle="Last 6 months"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>}
              trend={{ value: 7.3, isPositive: true }}
            />
            <StatCard
              title="Avg Order Value"
              value={378}
              subtitle="Per order"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>}
              trend={{ value: 3.2, isPositive: true }}
            />
            <StatCard
              title="Active Branches"
              value={3}
              subtitle="Out of 4 total"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" /><path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" /></svg>}
              trend={{ value: 0, isPositive: true }}
            />
          </div>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4 h-48 pt-4">
                {mockMonthlyRevenue.map((d, i) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      ₹{(d.revenue / 1000).toFixed(0)}k
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.revenue / maxRevenue) * 140}px` }}
                      transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
                      className="w-full rounded-t-lg bg-primary/80 hover:bg-primary transition-colors cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground">{d.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Restaurants */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Restaurants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-left py-3 px-4 font-semibold">Restaurant</th>
                      <th className="text-left py-3 px-4 font-semibold">Location</th>
                      <th className="text-left py-3 px-4 font-semibold">Revenue</th>
                      <th className="text-left py-3 px-4 font-semibold">Orders</th>
                      <th className="text-left py-3 px-4 font-semibold">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTopRestaurants.map((r, i) => (
                      <motion.tr
                        key={r.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="py-3 px-4 font-semibold text-foreground">{r.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{r.location}</td>
                        <td className="py-3 px-4 text-muted-foreground">₹{r.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4 text-muted-foreground">{r.orders.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={r.growth >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {r.growth >= 0 ? '+' : ''}{r.growth}%
                          </span>
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
