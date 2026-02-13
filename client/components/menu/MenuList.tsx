'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Select, Modal } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

export function MenuList() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { toast, ToastContainer } = useToast();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm, categoryFilter]);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/menu', {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch menu');

      const data = await response.json();
      setItems(data);
    } catch (error) {
      toast('Failed to load menu items', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'All') {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    setFilteredItems(filtered);
  };

  const categories = ['All', ...new Set(items.map((item) => item.category))];

  const handleEdit = (item: MenuItem) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  const handleToggleAvailability = async (id: number, available: boolean) => {
    try {
      const response = await fetch(`http://localhost:4000/api/menu/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ available: !available }),
      });

      if (!response.ok) throw new Error('Failed to update');

      toast('Item updated successfully', 'success');
      fetchMenuItems();
    } catch (error) {
      toast('Failed to update item', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`http://localhost:4000/api/menu/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast('Item deleted successfully', 'success');
      fetchMenuItems();
    } catch (error) {
      toast('Failed to delete item', 'error');
    }
  };

  return (
    <>
      <ToastContainer />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Menu Items</CardTitle>
            <div className="flex gap-3">
              <Input
                placeholder="Search menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={categories.map((cat) => ({ value: cat, label: cat }))}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton h-48" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-lg font-semibold mb-2">No items found</h3>
              <p className="text-gray-400 text-sm">
                {searchTerm || categoryFilter !== 'All'
                  ? 'Try adjusting your filters'
                  : 'Start by uploading a menu or adding items manually'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="menu-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="badge badge-default">{item.category}</span>
                    <span className="text-xl font-bold text-green-500">
                      ₹{item.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleAvailability(item.id, item.available)}
                      className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                        item.available
                          ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                          : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                      }`}
                    >
                      {item.available ? '✓ Available' : '✕ Unavailable'}
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 hover:bg-gray-800 rounded transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 hover:bg-red-500/20 text-red-500 rounded transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
