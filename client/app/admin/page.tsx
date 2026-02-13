'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout';
import { Header, Container } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

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
        <Header
          title="Admin Dashboard"
          subtitle="Manage all restaurants and view system-wide analytics"
        />

        <Container className="py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">🏢</span>
                <Badge variant="success">Live</Badge>
              </div>
              <h3 className="text-3xl font-bold">{stats.totalRestaurants}</h3>
              <p className="text-gray-400 text-sm mt-1">Total Restaurants</p>
              <p className="text-green-500 text-xs mt-2">
                {stats.activeRestaurants} active
              </p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">💰</span>
              </div>
              <h3 className="text-3xl font-bold">₹{(stats.totalRevenue / 1000).toFixed(0)}K</h3>
              <p className="text-gray-400 text-sm mt-1">Total Revenue</p>
              <p className="text-green-500 text-xs mt-2">+12% from last month</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">🛎️</span>
              </div>
              <h3 className="text-3xl font-bold">{stats.totalOrders}</h3>
              <p className="text-gray-400 text-sm mt-1">Total Orders</p>
              <p className="text-green-500 text-xs mt-2">+8% from last month</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-3xl font-bold">
                ₹{Math.round(stats.totalRevenue / stats.totalOrders)}
              </h3>
              <p className="text-gray-400 text-sm mt-1">Avg Order Value</p>
              <p className="text-green-500 text-xs mt-2">+5% from last month</p>
            </div>
          </div>

          {/* Restaurants Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Restaurants</CardTitle>
                <button className="btn-primary">
                  <span className="text-lg">➕</span>
                  Add Restaurant
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Restaurant</th>
                      <th>Location</th>
                      <th>Orders</th>
                      <th>Revenue</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restaurants.map((restaurant) => (
                      <tr key={restaurant.id}>
                        <td>
                          <div className="font-medium">{restaurant.name}</div>
                        </td>
                        <td className="text-gray-400">{restaurant.location}</td>
                        <td>{restaurant.totalOrders}</td>
                        <td className="font-medium">₹{(restaurant.revenue / 1000).toFixed(0)}K</td>
                        <td>
                          <Badge variant={restaurant.status === 'active' ? 'success' : 'danger'}>
                            {restaurant.status}
                          </Badge>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button className="text-gray-400 hover:text-white">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button className="text-gray-400 hover:text-white">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
