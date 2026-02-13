'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout';
import { Header, Container } from '@/components/layout';
import { PDFMenuUploader } from '@/components/menu/PDFMenuUploader';
import { MenuList } from '@/components/menu/MenuList';
import { useState } from 'react';

export default function MenuManagementPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'upload'>('list');

  return (
    <ProtectedRoute allowedRoles={['admin', 'manager']}>
      <DashboardLayout role="manager">
        <Header
          title="Menu Management"
          subtitle="Manage your restaurant menu items"
        />
        <Container className="py-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-800">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'list'
                  ? 'text-white border-b-2 border-green-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Menu Items
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'upload'
                  ? 'text-white border-b-2 border-green-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Upload PDF Menu
            </button>
          </div>

          {/* Content */}
          {activeTab === 'list' ? <MenuList /> : <PDFMenuUploader />}
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
