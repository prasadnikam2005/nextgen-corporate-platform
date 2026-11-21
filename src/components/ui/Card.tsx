'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  bordered?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = false,
  bordered = true,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white rounded-xl p-6 transition-all duration-200 text-slate-900',
          bordered && 'border border-slate-200/80 shadow-xs',
          hoverEffect && 'hover:border-slate-300 hover:shadow-sm hover:-translate-y-0.5',
          glow && 'border-blue-300/80 shadow-sm ring-1 ring-blue-500/10',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
