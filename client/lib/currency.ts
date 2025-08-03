/**
 * Formats currency in Indian Rupees with proper Indian number formatting
 * Uses the Indian numbering system (lakhs, crores)
 */
export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats large numbers in Indian style (lakhs, crores)
 */
export const formatIndianNumber = (amount: number): string => {
  if (amount >= 10000000) { // 1 crore
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  } else if (amount >= 100000) { // 1 lakh
    return `₹${(amount / 100000).toFixed(1)} L`;
  } else if (amount >= 1000) { // 1 thousand
    return `₹${(amount / 1000).toFixed(1)} K`;
  } else {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
};

/**
 * Converts USD amounts to approximate INR (using 1 USD = 83 INR)
 */
export const convertToINR = (usdAmount: number): number => {
  return Math.round(usdAmount * 83);
};
