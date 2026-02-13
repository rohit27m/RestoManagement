'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarProps {
  role: 'admin' | 'manager';
}

const Sidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname();

  const adminMenuItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/restaurants', label: 'Restaurants', icon: '🏢' },
    { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { href: '/admin/invoices', label: 'Invoices', icon: '🧾' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  const managerMenuItems = [
    { href: '/manager', label: 'Dashboard', icon: '📊' },
    { href: '/manager/menu', label: 'Menu Management', icon: '📋' },
    { href: '/manager/orders', label: 'Orders', icon: '🛎️' },
    { href: '/manager/tables', label: 'Tables', icon: '🪑' },
    { href: '/manager/analytics', label: 'Analytics', icon: '📈' },
    { href: '/manager/invoices', label: 'Invoices', icon: '🧾' },
  ];

  const menuItems = role === 'admin' ? adminMenuItems : managerMenuItems;

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">RestaurantOS</h1>
        <p className="text-sm text-gray-400 mt-1">
          {role === 'admin' ? 'Admin Panel' : 'Manager Panel'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'sidebar-item',
                isActive && 'sidebar-item-active'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
        <button className="sidebar-item w-full">
          <span className="text-lg">👤</span>
          <span>Profile</span>
        </button>
        <button className="sidebar-item w-full text-red-500 hover:bg-red-500/10">
          <span className="text-lg">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export { Sidebar };
