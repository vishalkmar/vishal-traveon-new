/**
 * Format price to display with comma separators and no decimals
 * Example: 34000.00 -> 34,000
 * Example: ₹34000.00 -> ₹34,000
 */
export const formatPrice = (price) => {
  if (!price) return "0";

  // Convert to string and remove any currency symbols
  let priceStr = String(price).trim();
  
  // Remove rupee symbol if present
  priceStr = priceStr.replace("₹", "").trim();
  
  // Convert to number and round to nearest integer
  const numPrice = Math.round(parseFloat(priceStr) || 0);
  
  // Format with comma separators using Indian numbering system
  return numPrice.toLocaleString("en-IN");
};

/**
 * Format price with rupee symbol
 * Example: 34000.00 -> ₹34,000
 */
export const formatPriceWithSymbol = (price) => {
  return `₹${formatPrice(price)}`;
};
