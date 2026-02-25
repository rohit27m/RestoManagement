'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, StatCard } from '@/components/ui';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Restaurant {
  id: number;
  name: string;
  location: string;
  totalOrders: number;
  revenue: number;
  status: 'active' | 'inactive';
  manager: string;
  tables: number;
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mock: Restaurant[] = [
      { id: 1, name: 'Downtown Bistro', location: 'Mumbai', totalOrders: 1250, revenue: 450000, status: 'active', manager: 'Arjun Sharma', tables: 20 },
      { id: 2, name: 'Coastal Kitchen', location: 'Goa', totalOrders: 890, revenue: 320000, status: 'active', manager: 'Priya Nair', tables: 15 },
      { id: 3, name: 'Urban Cafe', location: 'Bangalore', totalOrders: 1450, revenue: 580000, status: 'active', manager: 'Rohan Mehta', tables: 25 },
      { id: 4, name: 'Mountain Grill', location: 'Manali', totalOrders: 750, revenue: 290000, status: 'inactive', manager: 'Sita Verma', tables: 12 },
    ];
    setRestaurants(mock);
    setIsLoading(false);
  }, []);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout role="admin">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold tracking-tight text-foreground"
              >
                Restaurants
              </motion.h2>
              <p className="text-muted-foreground text-sm font-medium mt-1">
                Manage all restaurant branches in the network
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="M12 5v14" />
                </svg>
              }
            >
              Add Restaurant
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Restaurants"
              value={restaurants.length}
              subtitle="In network"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" /><path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" /></svg>}
              trend={{ value: 8.2, isPositive: true }}
            />
            <StatCard
              title="Active"
              value={restaurants.filter(r => r.status === 'active').length}
              subtitle="Currently operating"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
              trend={{ value: 0, isPositive: true }}
            />
            <StatCard
              title="Inactive"
              value={restaurants.filter(r => r.status === 'inactive').length}
              subtitle="Temporarily closed"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>}
              trend={{ value: 0, isPositive: false }}
            />
          </div>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Restaurants</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground text-sm text-center py-8">Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="text-left py-3 px-4 font-semibold">Name</th>
                        <th className="text-left py-3 px-4 font-semibold">Location</th>
                        <th className="text-left py-3 px-4 font-semibold">Manager</th>
                        <th className="text-left py-3 px-4 font-semibold">Tables</th>
                        <th className="text-left py-3 px-4 font-semibold">Orders</th>
                        <th className="text-left py-3 px-4 font-semibold">Revenue</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {restaurants.map((r, i) => (
                        <motion.tr
                          key={r.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                        >
                          <td className="py-3 px-4 font-semibold text-foreground">{r.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{r.location}</td>
                          <td className="py-3 px-4 text-muted-foreground">{r.manager}</td>
                          <td className="py-3 px-4 text-muted-foreground">{r.tables}</td>
                          <td className="py-3 px-4 text-muted-foreground">{r.totalOrders.toLocaleString()}</td>
                          <td className="py-3 px-4 text-muted-foreground">₹{r.revenue.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <Badge variant={r.status === 'active' ? 'success' : 'warning'}>
                              {r.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm">View</Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
