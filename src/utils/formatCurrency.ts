/**
 * PetCare Indian Rupee (INR) Currency Formatter
 * Uses Intl.NumberFormat with locale 'en-IN' and currency 'INR'
 */
export function formatINR(
  amount: number | undefined | null,
  options?: {
    showDecimals?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  // If number has fractional part, default to 2 decimal places, else 0 decimal places unless specified
  const hasFraction = amount % 1 !== 0;
  const minDigits = options?.minimumFractionDigits ?? (options?.showDecimals || hasFraction ? 2 : 0);
  const maxDigits = options?.maximumFractionDigits ?? 2;

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
  });

  return formatter.format(amount);
}
