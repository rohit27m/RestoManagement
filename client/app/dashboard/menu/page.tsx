'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout';
import { Badge, Button } from '@/components/ui';
import { PDFMenuUploader } from '@/components/menu/PDFMenuUploader';
import { MenuList } from '@/components/menu/MenuList';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MenuManagementPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'upload'>('list');

  return (
    <ProtectedRoute >
      <DashboardLayout >
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Menu Architecture</h2>
              <p className="text-muted-foreground text-sm font-medium mt-1">Design and manage your culinary offerings</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">Export Menu</Button>
              <Button variant="primary" size="sm" onClick={() => setActiveTab('upload')}>
                Import from PDF
              </Button>
            </div>
          </div>

          {/* Premium Tab Switcher */}
          <div className="inline-flex p-1 bg-secondary rounded-2xl border border-border/50">
            <button
              onClick={() => setActiveTab('list')}
              className={`relative px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'list' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {activeTab === 'list' && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">Current Inventory</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`relative px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'upload' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {activeTab === 'upload' && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">Digital Import</span>
            </button>
          </div>

          {/* Content with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-card border border-border rounded-2xl overflow-hidden p-1"
            >
              <div className="p-6">
                {activeTab === 'list' ? <MenuList /> : <PDFMenuUploader />}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
