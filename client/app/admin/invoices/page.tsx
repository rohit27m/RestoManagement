'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout';
import { Header, Container } from '@/components/layout';
import { InvoiceGenerator } from '@/components/invoice/InvoiceGenerator';

export default function AdminInvoicesPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout role="admin">
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
