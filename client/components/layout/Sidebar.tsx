'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Overview',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
      )
    },
    {
      href: '/dashboard/restaurants',
      label: 'Restaurants',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></svg>
      )
    },
    {
      href: '/dashboard/menu',
      label: 'Menu',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M2 12h20" /><path d="m4.93 4.93 14.14 14.14" /><path d="m4.93 19.07 14.14-14.14" /></svg>
      )
    },
    {
      href: '/dashboard/orders',
      label: 'Orders',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
      )
    },
    {
      href: '/dashboard/tables',
      label: 'Tables',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h18" /><path d="M3 14h18" /><path d="M3 18h18" /><path d="M3 6h18" /></svg>
      )
    },
    {
      href: '/dashboard/kitchen',
      label: 'Kitchen Station',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M2 12h20" /><path d="M8 22v-4a4 4 0 0 1 8 0v4" /><path d="M12 2v4" /></svg>
      )
    },
    {
      href: '/dashboard/service',
      label: 'Service Staff',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
      )
    },
    {
      href: '/dashboard/analytics',
      label: 'Insights & Data',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
      )
    },
    {
      href: '/dashboard/invoices',
      label: 'Invoices',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
      )
    },
  ];

  return (
    <aside className="w-64 glass-sidebar border-r border-white/10 flex flex-col h-screen sticky top-0 bg-background/60 backdrop-blur-2xl z-50 overflow-y-auto">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-4 group px-2 mb-8 relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-premium-primary transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow-primary-soft relative z-10 border border-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M12 12c-3.5 0-6.5-1.5-6.5-4.5S8.5 3 12 3s6.5 1.5 6.5 4.5-3 4.5-6.5 4.5Z" /><path d="M12 12c3.5 0 6.5 1.5 6.5 4.5S15.5 21 12 21s-6.5-1.5-6.5-4.5 3-4.5 6.5-4.5Z" /></svg>
          </div>
          <div className="relative z-10">
            <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 drop-shadow-sm">RestoPro</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
              Enterprise
            </p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group overflow-hidden',
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                      : 'text-muted-foreground hover:bg-white/5 border border-transparent'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav2"
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {isActive && (
                    <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-full shadow-glow-primary-icon" />
                  )}
                  
                  <div className={cn(
                    "transition-colors duration-300 relative z-10",
                    isActive ? "text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" : "group-hover:text-foreground/90"
                  )}>
                    {item.icon}
                  </div>
                  <span className={cn(
                    "font-medium text-[15px] relative z-10 transition-colors duration-300",
                    isActive ? "text-primary font-semibold drop-shadow" : ""
                  )}>{item.label}</span>

                  {isActive && (
                    <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary shadow-glow-primary-icon animate-pulse" />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-5">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-primary/20 relative overflow-hidden group">
          <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 to-accent/30 opacity-0 blur-xl group-hover:opacity-100 transition-opacity duration-700 -z-10" />
          <div className="absolute top-0 right-0 p-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
          </div>
          <p className="text-[10px] font-black tracking-widest text-primary mb-1 uppercase">SaaS Enterprise</p>
          <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">
            All features & modules unlocked.
          </p>
        </div>

        <div className="space-y-1 bg-white/5 p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
          <Link href="/dashboard/profile">
            <motion.div
              whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs ring-2 ring-transparent group-hover:ring-primary/50 transition-all">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col">
                 <span className="text-sm font-semibold capitalize text-foreground/90">{user?.username || 'User'}</span>
                 <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{user?.role || 'Access'}</span>
              </div>
            </motion.div>
          </Link>
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
            <span className="text-sm font-semibold">Sign Out</span>
          </motion.button>
        </div>
      </div>
    </aside>
  );
};

export { Sidebar };
