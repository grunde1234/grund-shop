import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//convert prisma object into a regular js object function
export function convertToPlainObject<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

//format numbers with decimals
export function formatNumber (num: number): string {
  const [int, decimal] = num.toString().split('.');
  
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`
}