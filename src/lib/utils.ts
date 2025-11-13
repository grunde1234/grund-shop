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

//format errors
//eslint-disable-next-line @typescript-eslint/no-explicit-any
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