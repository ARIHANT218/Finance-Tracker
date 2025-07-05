// components/ui/card.tsx
import * as React from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a utility for class merging

// Basic cn utility if you don't have it (usually from shadcn setup)
// lib/utils.ts
// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }
// You'd need 'clsx' and 'tailwind-merge' installed:
// npm install clsx tailwind-merge

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border bg-card text-card-foreground shadow',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardContent };
