'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, StatCard } from '@/components/ui';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

interface Restaurant {
  id: number;
  name: string;
  location: string;
  totalOrders: number;
  revenue: number;
  status: 'active' | 'inactive';
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalRevenue: 0,
    totalOrders: 0,
    activeRestaurants: 0,
  });

  useEffect(() => {
    // Mock data - replace with API call
    const mockRestaurants: Restaurant[] = [
      { id: 1, name: 'Downtown Bistro', location: 'Mumbai', totalOrders: 1250, revenue: 450000, status: 'active' },
      { id: 2, name: 'Coastal Kitchen', location: 'Goa', totalOrders: 890, revenue: 320000, status: 'active' },
      { id: 3, name: 'Urban Cafe', location: 'Bangalore', totalOrders: 1450, revenue: 580000, status: 'active' },
      { id: 4, name: 'Mountain Grill', location: 'Manali', totalOrders: 750, revenue: 290000, status: 'active' },
    ];

    setRestaurants(mockRestaurants);
    setStats({
      totalRestaurants: mockRestaurants.length,
      totalRevenue: mockRestaurants.reduce((sum, r) => sum + r.revenue, 0),
      totalOrders: mockRestaurants.reduce((sum, r) => sum + r.totalOrders, 0),
      activeRestaurants: mockRestaurants.filter((r) => r.status === 'active').length,
    });
  }, []);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout role="admin">
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold tracking-tight text-foreground"
              >
                System Intelligence
              </motion.h2>
              <p className="text-muted-foreground text-sm font-medium mt-1">
                Real-time overview of the RestoPro ecosystem
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm">Download Report</Button>
              <Button variant="primary" size="sm" leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
              }>
                Add Restaurant
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Fleet"
              value={stats.totalRestaurants}
              subtitle={`${stats.activeRestaurants} restaurants active`}
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" /><path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" /><path d="M13 13h4" /><path d="M13 17h4" /></svg>}
              trend={{ value: 8.2, isPositive: true }}
            />
            <StatCard
              title="Network Revenue"
              value={stats.totalRevenue}
              subtitle="All regions combined"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
              trend={{ value: 12.5, isPositive: true }}
            />
            <StatCard
              title="Daily Flow"
              value={stats.totalOrders}
              subtitle="Orders processed today"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>}
              trend={{ value: 5.1, isPositive: true }}
            />
            <StatCard
              title="Avg Order"
              value={Math.round(stats.totalRevenue / stats.totalOrders)}
              subtitle="Value per customer"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>}
              trend={{ value: 2.3, isPositive: false }}
            />
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Restaurants Directory</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">Manage and monitor your active portfolio</p>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1 bg-secondary rounded-lg text-xs font-semibold text-foreground">Sort: Revenue</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="px-4 py-3 font-medium">Restaurant</th>
                        <th className="px-4 py-3 font-medium">Region</th>
                        <th className="px-4 py-3 font-medium">Performance</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {restaurants.map((restaurant) => (
                        <tr key={restaurant.id} className="group hover:bg-muted/30 transition-colors duration-200">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                {restaurant.name.charAt(0)}
                              </div>
                              <span className="font-semibold text-foreground">{restaurant.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">{restaurant.location}</td>
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              <div className="text-foreground font-medium">₹{(restaurant.revenue / 1000).toFixed(0)}K</div>
                              <div className="text-[10px] text-muted-foreground">{restaurant.totalOrders} orders</div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Badge className={restaurant.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-none' : 'bg-rose-500/10 text-rose-500 border-none'}>
                              {restaurant.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" /><circle cx="12" cy="12" r="3" /></svg>
                              </button>
                              <button className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
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

            <div className="space-y-8">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg">System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-muted-foreground uppercase">Server Load</span>
                      <span className="text-foreground">24%</span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '24%' }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-muted-foreground uppercase">API Latency</span>
                      <span className="text-emerald-500">Normal</span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '92%' }}
                        className="h-full bg-emerald-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                      <div className="space-y-0.5">
                        <p className="text-white font-medium">New restaurant onboarding</p>
                        <p className="text-[#a3a3a3] text-xs">Coastal Kitchen completed setup</p>
                        <p className="text-[#737373] text-[10px]">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
