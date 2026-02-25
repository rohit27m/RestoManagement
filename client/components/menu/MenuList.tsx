'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Select, Badge } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';


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
      // Mocking for now to ensure UI looks good even if backend is not running
      const mockItems: MenuItem[] = [
        { id: 1, name: 'Saffron Risotto', description: 'Creamy Arborio rice infused with premium Persian saffron and aged Parmesan.', price: 1250, category: 'Main Course', available: true },
        { id: 2, name: 'Truffle Tagliatelle', description: 'Hand-cut pasta tossed in black truffle butter and seasonal mushrooms.', price: 1450, category: 'Pasta', available: true },
        { id: 3, name: 'Spiced Lamb Chops', description: 'Tender lamb marinated in house secret spices, chargrilled to perfection.', price: 1850, category: 'Grill', available: false },
      ];
      setItems(mockItems);
    } catch (error) {
      toast('Failed to load menu items', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    setFilteredItems(filtered);
  };

  const categories = ['All', ...new Set(items.map((item) => item.category))];

  return (
    <div className="space-y-6">
      <ToastContainer />
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-secondary/30 p-4 rounded-2xl border border-border/50">
        <div className="relative w-full md:w-96">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          <input
            placeholder="Search our collection..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={categories.map((cat) => ({ value: cat, label: cat }))}
            className="min-w-[160px]"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group"
              >
                <Card className="h-full group-hover:border-primary/50 group-hover:shadow-xl transition-all duration-300">
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-bold uppercase tracking-widest">{item.category}</Badge>
                        <h3 className="text-xl font-bold text-foreground leading-tight tracking-tight">{item.name}</h3>
                      </div>
                      <div className="text-xl font-black text-foreground">₹{item.price}</div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                      {item.description}
                    </p>

                    <div className="pt-4 flex items-center gap-3 border-t border-border/50">
                      <Badge className={cn(
                        "flex-1 justify-center py-2 text-[10px] uppercase tracking-widest font-bold",
                        item.available ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                      )}>
                        {item.available ? "Ready to Serve" : "Out of Stock"}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="ghost" className="h-9 w-9 p-0 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </Button>
                        <Button variant="ghost" className="h-9 w-9 p-0 rounded-lg text-rose-500 hover:bg-rose-500/10">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
