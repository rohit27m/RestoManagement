'use client';

import { HTMLAttributes, ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  loading = false,
  className,
  ...props
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (typeof value === 'number' && !loading) {
      const duration = 1000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [value, loading]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-default bg-surface p-6',
        'hover:shadow-lg hover:border-success/20 transition-all duration-300',
        'dark:bg-dark-surface dark:border-dark-border',
        className
      )}
      {...props}
    >
      {/* Icon */}
      {icon && (
        <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-success/10 text-success">
          {icon}
        </div>
      )}

      {/* Title */}
      <div className="text-sm font-medium text-tertiary mb-1">{title}</div>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <div className="text-3xl font-bold tracking-tight">
          {loading ? (
            <div className="h-9 w-24 bg-black/5 dark:bg-white/5 rounded animate-pulse" />
          ) : typeof value === 'number' ? (
            displayValue.toLocaleString()
          ) : (
            value
          )}
        </div>
        
        {change && !loading && (
          <div
            className={cn(
              'text-xs font-medium flex items-center gap-1',
              changeType === 'positive' && 'text-success',
              changeType === 'negative' && 'text-danger',
              changeType === 'neutral' && 'text-tertiary'
            )}
          >
            {changeType === 'positive' && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 2L6 10M6 2L2 6M6 2L10 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {changeType === 'negative' && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 10L6 2M6 10L10 6M6 10L2 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {change}
          </div>
        )}
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-success/0 via-success/5 to-success/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
}
