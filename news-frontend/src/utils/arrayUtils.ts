/**
 * Safely converts a potentially null array to an empty array
 */
export const safeArray = <T>(arr: T[] | null | undefined): T[] => {
  return arr || [];
};

/**
 * Safely gets the first item from a potentially null array
 */
export const safeFirst = <T>(arr: T[] | null | undefined): T | undefined => {
  return safeArray(arr)[0];
};

/**
 * Safely checks if an array has items
 */
export const hasItems = <T>(arr: T[] | null | undefined): boolean => {
  return safeArray(arr).length > 0;
};
