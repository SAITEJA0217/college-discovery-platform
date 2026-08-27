import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
}

export function Badge({ className = '', variant = 'default', children, ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';
  
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground',
    success: 'border-transparent bg-success text-success-foreground',
    warning: 'border-transparent bg-warning text-warning-foreground',
    danger: 'border-transparent bg-danger text-danger-foreground',
    outline: 'text-foreground border-border',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
