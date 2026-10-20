import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'gold' };

export function Button({ className, variant = 'primary', ...props }: Props) {
  return (
    <button
      {...props}
      className={cn(variant === 'gold' ? 'btn-gold' : 'btn-primary', 'disabled:opacity-60', className)}
    />
  );
}