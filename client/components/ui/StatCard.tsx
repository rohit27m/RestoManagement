'use client';

import { HTMLAttributes, ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: ReactNode;
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
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
      <div className="text-sm font-medium text-secondary mb-2">{title}</div>

      {/* Value */}
      <div className="text-3xl font-bold tracking-tight text-foreground mb-1">
        {loading ? (
          <div className="h-9 w-24 bg-foreground/5 rounded animate-pulse" />
        ) : typeof value === 'number' ? (
          displayValue.toLocaleString()
        ) : (
          value
        )}
      </div>
      
      {/* Subtitle */}
      {subtitle && (
        <div className="text-sm text-secondary mb-2">{subtitle}</div>
      )}

      {/* Trend */}
      {trend && !loading && (
        <div
          className={cn(
            'text-xs font-medium flex items-center gap-1',
            trend.isPositive ? 'text-success' : 'text-danger'
          )}
        >
          {trend.isPositive ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 2L6 10M6 2L2 6M6 2L10 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
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
          {trend.value}% vs yesterday
        </div>
      )}

      {/* Background gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-success/0 via-success/50 to-success/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-success/0 via-success/5 to-success/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
}
