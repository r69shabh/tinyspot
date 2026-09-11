// Exchange rate: ₹2,99,900 / $3,600 = 83.3055 INR per USD
export const INR_PER_USD = 83.3055;

export function formatUSD(amountUSD) {
  if (amountUSD === undefined || amountUSD === null) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amountUSD);
}

export function formatINR(amountINR) {
  if (amountINR === undefined || amountINR === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amountINR);
}

export function formatPrice(amountUSD, currency = 'USD') {
  if (currency === 'INR') {
    const inr = Math.round(amountUSD * INR_PER_USD);
    return formatINR(inr);
  }
  return formatUSD(amountUSD);
}

export function usdToInr(amountUSD) {
  return Math.round(amountUSD * INR_PER_USD);
}

export function inrToUsd(amountINR) {
  return Math.round(amountINR / INR_PER_USD);
}
