import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
/* import { number } from "zod";
 */
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

//format errors
export function formatError(error: any) {
 const zodErrors = error.errors || error.issues;
if (Array.isArray(zodErrors)) {
  const fieldErrors = zodErrors.map((err: any) => err.message);
  return fieldErrors.join(', ');
}
else if(error.name === 'PrismaClientKnownRequestError' && error.code === 'P2002'){
    //handle prisma errors
    const field = error.meta?.target ? error.meta.target[0] : 'field';//get the field that caused the error and it is a single field
    return `The ${field.charAt(0).toUpperCase() + field.slice(1)} is already in use. Please choose a different ${field}.`;
  }else {
    //handle other errors
    return typeof error.message === 'string' ? error.message : 'An unexpected error occurred. Please try again.';
  }
}

//round to 2 decimals
export function round2(value: number | string) {
  if(typeof value === 'number'){
    /* return Math.round((value + Number.EPSILON) * 100) / 100; */
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }else if(typeof value === 'string'){
     return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  }else{
    throw new Error('Invalid value type');
  }
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US',{
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2
});

//Apply fomatter in a function to format currency
export function formatCurrency(amount: number | string | null){
if(typeof amount === 'number'){
return CURRENCY_FORMATTER.format(amount)
}
else if(typeof amount === 'string'){
  return CURRENCY_FORMATTER.format(Number(amount))
}
else {
  return 'NaN'
}
}

