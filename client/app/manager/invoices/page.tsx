'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout';
import { Header, Container } from '@/components/layout';
import { InvoiceGenerator } from '@/components/invoice/InvoiceGenerator';

export default function InvoicesPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'manager']}>
      <DashboardLayout role="manager">
        <Header
          title="Invoice Generator"
          subtitle="Create and download professional invoices"
        />
        <Container className="py-8">
          <InvoiceGenerator />
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
