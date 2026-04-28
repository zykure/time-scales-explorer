/**
 * Formats a number with:
 * - Thousands separators (e.g., 10 000)
 * - Max decimal places (default 2)
 * - Scientific notation for very large (>1e12) or very small (<1e-4) numbers
 */
export const formatNumber = (
  value: number,
  decimals: number = 2,
  minDecimals: number = decimals,
  useScientificThreshold: number = 1e12,
  useScientificSmallThreshold: number = 1e-4
): string => {
  if (isNaN(value)) return '0';

  // Handle extremely large or small numbers with scientific notation
  if (Math.abs(value) >= useScientificThreshold || (Math.abs(value) < useScientificSmallThreshold && value !== 0)) {
    return value.toExponential(decimals);
  }

  // Round to desired decimals
  const rounded = Number(value.toFixed(decimals));

  // Format with thousands separator
  // Note: 'en-US' uses commas, 'fr-FR' uses spaces. You can change locale.
  return rounded.toLocaleString('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: minDecimals,
  });
};

/**
 * Formats a large distance (km) specifically, often needing scientific notation
 */
export const formatDistance = (km: number): string => {
  return formatNumber(km, 2, 1e12, 1e-4);
};
