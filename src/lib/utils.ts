import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatETB(amount: number, locale: string = 'ar') {
  return locale === 'en'
    ? `${amount.toLocaleString('en-US')} ETB`
    : `${amount.toLocaleString('ar-ET')} بر`;
}