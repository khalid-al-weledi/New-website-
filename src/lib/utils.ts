import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatETB(amount: number) {
  return `${amount.toLocaleString('ar-ET')} بر`;
}