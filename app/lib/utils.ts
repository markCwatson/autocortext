import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function that merges an arbitrary number of class names, taking into account
 * both general class merging rules and the specific rules of the Tailwind CSS framework.
 *
 * @param {...ClassValue[]} inputs - The input class values to be merged.
 * @returns {string} The merged class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
